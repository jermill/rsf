-- =====================================================
-- Payment Tracking & Admin Tasks System
-- Created: 2025-11-17
-- Description: Track payment setup status and create admin follow-up tasks
-- =====================================================

-- Add payment tracking fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS payment_setup_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_setup_status TEXT DEFAULT 'pending' CHECK (payment_setup_status IN ('pending', 'completed', 'failed', 'cancelled'));

-- Create admin_tasks table for follow-up reminders
CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Task details
    task_type TEXT NOT NULL, -- e.g., 'payment_setup_required', 'onboarding_follow_up', 'check_in'
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Dates
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata
    metadata JSONB -- For flexible additional data
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_user_id ON public.admin_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON public.admin_tasks(status);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_priority ON public.admin_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_task_type ON public.admin_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_due_date ON public.admin_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON public.admin_tasks(assigned_to);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_admin_tasks_status_priority ON public.admin_tasks(status, priority, due_date);

-- Enable RLS
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all tasks" ON public.admin_tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins can create tasks" ON public.admin_tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins can update tasks" ON public.admin_tasks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins can delete tasks" ON public.admin_tasks
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'superadmin')
        )
    );

-- Allow service role and authenticated users (for onboarding) to insert tasks
CREATE POLICY "Service can insert tasks" ON public.admin_tasks
    FOR INSERT
    WITH CHECK (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_admin_tasks_updated_at ON public.admin_tasks;
CREATE TRIGGER trigger_update_admin_tasks_updated_at
    BEFORE UPDATE ON public.admin_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tasks_updated_at();

-- Function to get pending payment setup tasks
CREATE OR REPLACE FUNCTION get_pending_payment_tasks()
RETURNS TABLE (
    task_id UUID,
    user_id UUID,
    user_name TEXT,
    user_email TEXT,
    payment_model TEXT,
    selected_package TEXT,
    preferred_payment_method TEXT,
    days_since_onboarding INTEGER,
    priority TEXT,
    due_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as task_id,
        t.user_id,
        COALESCE(p.first_name || ' ' || p.last_name, 'Unknown') as user_name,
        u.email as user_email,
        p.payment_model,
        p.subscription_package as selected_package,
        p.preferred_payment_method,
        EXTRACT(DAY FROM CURRENT_TIMESTAMP - p.onboarding_completed_at)::INTEGER as days_since_onboarding,
        t.priority,
        t.due_date
    FROM public.admin_tasks t
    JOIN auth.users u ON t.user_id = u.id
    LEFT JOIN public.profiles p ON t.user_id = p.id
    WHERE t.task_type = 'payment_setup_required'
        AND t.status = 'pending'
        AND p.payment_setup_status = 'pending'
    ORDER BY t.priority DESC, t.due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON TABLE public.admin_tasks TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_pending_payment_tasks() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_admin_tasks_updated_at() TO authenticated, service_role;

-- Create index for payment tracking on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_payment_setup_status ON public.profiles(payment_setup_status);
CREATE INDEX IF NOT EXISTS idx_profiles_payment_setup_required ON public.profiles(payment_setup_required) WHERE payment_setup_required = true;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Payment tracking and admin tasks system created successfully!';
    RAISE NOTICE '📋 New table: admin_tasks for follow-up reminders';
    RAISE NOTICE '💳 Payment tracking fields added to profiles';
    RAISE NOTICE '🔍 Function: get_pending_payment_tasks() for dashboard';
END $$;

