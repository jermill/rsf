-- =====================================================
-- Enhanced Onboarding System
-- Created: 2025-11-17
-- Description: Comprehensive onboarding tracking and automation
-- =====================================================

-- Onboarding progress tracking table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 7,
  is_complete BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Step completion tracking
  steps_completed JSONB DEFAULT '{
    "welcome": false,
    "personal_info": false,
    "fitness_assessment": false,
    "goals_preferences": false,
    "medical_dietary": false,
    "schedule_availability": false,
    "first_booking": false
  }'::jsonb,
  
  -- Onboarding data (temporary storage before profile completion)
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  
  -- Engagement tracking
  time_spent_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 1,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Follow-up tracking
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  welcome_email_sent_at TIMESTAMPTZ,
  reminder_email_sent BOOLEAN DEFAULT FALSE,
  reminder_email_sent_at TIMESTAMPTZ,
  coach_assigned BOOLEAN DEFAULT FALSE,
  coach_id UUID REFERENCES auth.users(id),
  coach_assigned_at TIMESTAMPTZ,
  
  -- Metadata
  utm_source TEXT,
  utm_campaign TEXT,
  referral_code TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding checklist items
CREATE TABLE IF NOT EXISTS onboarding_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  item_key TEXT NOT NULL, -- e.g., 'complete_profile', 'upload_photo', 'book_first_session'
  item_title TEXT NOT NULL,
  item_description TEXT,
  item_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Action details
  action_type TEXT, -- 'link', 'modal', 'external'
  action_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, item_key)
);

-- Onboarding goals and recommendations
CREATE TABLE IF NOT EXISTS onboarding_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recommendation details
  recommendation_type TEXT NOT NULL, -- 'workout_plan', 'meal_plan', 'trainer', 'class'
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 5, -- 1-10, 10 being highest
  
  -- Recommendation data
  recommendation_data JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Welcome journey tracking
CREATE TABLE IF NOT EXISTS onboarding_journey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Journey tracking
  journey_stage TEXT NOT NULL, -- 'signup', 'profile_setup', 'goal_setting', 'first_session', 'active'
  milestone TEXT NOT NULL,
  milestone_data JSONB DEFAULT '{}'::jsonb,
  
  -- Engagement
  engagement_score INTEGER DEFAULT 0, -- 0-100
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_onboarding_progress_user ON onboarding_progress(user_id);
CREATE INDEX idx_onboarding_progress_complete ON onboarding_progress(is_complete);
CREATE INDEX idx_onboarding_checklist_user ON onboarding_checklist(user_id);
CREATE INDEX idx_onboarding_checklist_completed ON onboarding_checklist(is_completed);
CREATE INDEX idx_onboarding_recommendations_user ON onboarding_recommendations(user_id);
CREATE INDEX idx_onboarding_journey_user ON onboarding_journey(user_id);
CREATE INDEX idx_onboarding_journey_stage ON onboarding_journey(journey_stage);

-- Enable Row Level Security
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_journey ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_progress
CREATE POLICY "Users can view own onboarding progress"
  ON onboarding_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
  ON onboarding_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress"
  ON onboarding_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding progress"
  ON onboarding_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- RLS Policies for onboarding_checklist
CREATE POLICY "Users can view own checklist"
  ON onboarding_checklist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist"
  ON onboarding_checklist FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist items"
  ON onboarding_checklist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for onboarding_recommendations
CREATE POLICY "Users can view own recommendations"
  ON onboarding_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON onboarding_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for onboarding_journey
CREATE POLICY "Users can view own journey"
  ON onboarding_journey FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journey milestones"
  ON onboarding_journey FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all journeys"
  ON onboarding_journey FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Function to create initial onboarding progress
CREATE OR REPLACE FUNCTION create_onboarding_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO onboarding_progress (user_id, current_step, total_steps)
  VALUES (NEW.id, 1, 7)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default checklist items
  INSERT INTO onboarding_checklist (user_id, item_key, item_title, item_description, item_order, is_required)
  VALUES
    (NEW.id, 'complete_profile', 'Complete Your Profile', 'Add your personal information and photo', 1, true),
    (NEW.id, 'set_goals', 'Set Your Fitness Goals', 'Tell us what you want to achieve', 2, true),
    (NEW.id, 'fitness_assessment', 'Complete Fitness Assessment', 'Help us understand your current fitness level', 3, true),
    (NEW.id, 'upload_photo', 'Upload Progress Photo', 'Take your first progress photo', 4, false),
    (NEW.id, 'book_session', 'Book Your First Session', 'Schedule your intro session with a trainer', 5, true),
    (NEW.id, 'explore_app', 'Explore the App', 'Take a tour of all features', 6, false),
    (NEW.id, 'join_community', 'Join the Community', 'Connect with other members', 7, false)
  ON CONFLICT (user_id, item_key) DO NOTHING;
  
  -- Log journey milestone
  INSERT INTO onboarding_journey (user_id, journey_stage, milestone, engagement_score)
  VALUES (NEW.id, 'signup', 'User created account', 10);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create onboarding progress on user signup
DROP TRIGGER IF EXISTS create_onboarding_progress_trigger ON auth.users;
CREATE TRIGGER create_onboarding_progress_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_onboarding_progress();

-- Function to update onboarding progress
CREATE OR REPLACE FUNCTION update_onboarding_step(
  p_user_id UUID,
  p_step_key TEXT,
  p_step_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_current_step INTEGER;
  v_total_steps INTEGER;
  v_steps_completed JSONB;
  v_all_complete BOOLEAN;
BEGIN
  -- Get current progress
  SELECT current_step, total_steps, steps_completed
  INTO v_current_step, v_total_steps, v_steps_completed
  FROM onboarding_progress
  WHERE user_id = p_user_id;
  
  -- Mark step as complete
  v_steps_completed := jsonb_set(v_steps_completed, ARRAY[p_step_key], 'true'::jsonb);
  
  -- Check if all steps are complete
  v_all_complete := (
    SELECT bool_and((value)::boolean)
    FROM jsonb_each(v_steps_completed)
  );
  
  -- Update progress
  UPDATE onboarding_progress
  SET 
    steps_completed = v_steps_completed,
    current_step = LEAST(v_current_step + 1, v_total_steps),
    is_complete = v_all_complete,
    completed_at = CASE WHEN v_all_complete THEN NOW() ELSE completed_at END,
    onboarding_data = COALESCE(onboarding_data, '{}'::jsonb) || COALESCE(p_step_data, '{}'::jsonb),
    last_activity_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log journey milestone
  INSERT INTO onboarding_journey (user_id, journey_stage, milestone, milestone_data, engagement_score)
  VALUES (
    p_user_id, 
    'profile_setup', 
    'Completed step: ' || p_step_key,
    p_step_data,
    CASE WHEN v_all_complete THEN 100 ELSE v_current_step * 15 END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get onboarding statistics (for admin dashboard)
CREATE OR REPLACE FUNCTION get_onboarding_stats()
RETURNS TABLE (
  total_users BIGINT,
  in_progress BIGINT,
  completed BIGINT,
  completion_rate NUMERIC,
  avg_time_to_complete_hours NUMERIC,
  stuck_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_users,
    COUNT(*) FILTER (WHERE NOT is_complete)::BIGINT as in_progress,
    COUNT(*) FILTER (WHERE is_complete)::BIGINT as completed,
    ROUND(
      (COUNT(*) FILTER (WHERE is_complete)::NUMERIC / NULLIF(COUNT(*), 0) * 100),
      2
    ) as completion_rate,
    ROUND(
      AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600)
      FILTER (WHERE is_complete),
      2
    ) as avg_time_to_complete_hours,
    COUNT(*) FILTER (
      WHERE NOT is_complete 
      AND last_activity_at < NOW() - INTERVAL '3 days'
    )::BIGINT as stuck_users
  FROM onboarding_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate personalized recommendations
CREATE OR REPLACE FUNCTION generate_onboarding_recommendations(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_fitness_goals TEXT[];
  v_fitness_level TEXT;
  v_dietary_restrictions TEXT[];
BEGIN
  -- Get user profile data
  SELECT fitness_goals, fitness_level, dietary_restrictions
  INTO v_fitness_goals, v_fitness_level, v_dietary_restrictions
  FROM profiles
  WHERE id = p_user_id;
  
  -- Clear existing recommendations
  DELETE FROM onboarding_recommendations WHERE user_id = p_user_id;
  
  -- Generate recommendations based on goals
  IF 'weight_loss' = ANY(v_fitness_goals) THEN
    INSERT INTO onboarding_recommendations (user_id, recommendation_type, title, description, priority)
    VALUES (
      p_user_id,
      'meal_plan',
      'Weight Loss Meal Plan',
      'Customized nutrition plan designed for healthy weight loss',
      10
    );
  END IF;
  
  IF 'muscle_gain' = ANY(v_fitness_goals) THEN
    INSERT INTO onboarding_recommendations (user_id, recommendation_type, title, description, priority)
    VALUES (
      p_user_id,
      'workout_plan',
      'Muscle Building Program',
      'Structured strength training program for muscle growth',
      9
    );
  END IF;
  
  IF v_fitness_level = 'beginner' THEN
    INSERT INTO onboarding_recommendations (user_id, recommendation_type, title, description, priority)
    VALUES (
      p_user_id,
      'trainer',
      'Beginner-Friendly Personal Trainer',
      'Work with a trainer experienced in helping beginners',
      8
    );
  END IF;
  
  -- Always recommend first session
  INSERT INTO onboarding_recommendations (user_id, recommendation_type, title, description, priority)
  VALUES (
    p_user_id,
    'class',
    'Book Your Intro Session',
    'Free 30-minute consultation and gym orientation',
    10
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add onboarding-related columns to profiles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'onboarding_completed_at') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'welcome_message_sent') THEN
    ALTER TABLE profiles ADD COLUMN welcome_message_sent BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create updated_at trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_onboarding_progress_updated_at ON onboarding_progress;
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_checklist_updated_at ON onboarding_checklist;
CREATE TRIGGER update_onboarding_checklist_updated_at
  BEFORE UPDATE ON onboarding_checklist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_recommendations_updated_at ON onboarding_recommendations;
CREATE TRIGGER update_onboarding_recommendations_updated_at
  BEFORE UPDATE ON onboarding_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON onboarding_progress TO authenticated;
GRANT ALL ON onboarding_checklist TO authenticated;
GRANT ALL ON onboarding_recommendations TO authenticated;
GRANT ALL ON onboarding_journey TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Enhanced onboarding system created successfully!';
  RAISE NOTICE '📊 New tables: onboarding_progress, onboarding_checklist, onboarding_recommendations, onboarding_journey';
  RAISE NOTICE '🔧 New functions: update_onboarding_step(), get_onboarding_stats(), generate_onboarding_recommendations()';
END $$;

