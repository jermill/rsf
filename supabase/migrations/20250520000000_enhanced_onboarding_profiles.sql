-- =====================================================
-- Enhanced Onboarding - Profiles Table Updates
-- Created: 2025-11-17
-- Description: Add new columns to profiles table for comprehensive onboarding
-- =====================================================

-- Add new columns to profiles table
ALTER TABLE public.profiles

-- Step 1: Payment Model & Package Selection
ADD COLUMN IF NOT EXISTS payment_model TEXT CHECK (payment_model IN ('subscription', 'pay-as-you-go')),
ADD COLUMN IF NOT EXISTS subscription_package TEXT,

-- Step 2: Personal Information (phone already exists)
ADD COLUMN IF NOT EXISTS phone TEXT,

-- Step 3: Physical Stats & Measurements
ADD COLUMN IF NOT EXISTS height NUMERIC, -- in inches
ADD COLUMN IF NOT EXISTS weight NUMERIC, -- in lbs
ADD COLUMN IF NOT EXISTS chest NUMERIC, -- in inches
ADD COLUMN IF NOT EXISTS waist NUMERIC, -- in inches
ADD COLUMN IF NOT EXISTS hips NUMERIC, -- in inches

-- Step 4: Health & Medical Screening
ADD COLUMN IF NOT EXISTS medical_conditions TEXT[], -- array of conditions
ADD COLUMN IF NOT EXISTS injuries TEXT,
ADD COLUMN IF NOT EXISTS medications TEXT,
ADD COLUMN IF NOT EXISTS doctor_clearance TEXT,

-- Step 5: Enhanced Fitness Goals
ADD COLUMN IF NOT EXISTS specific_goal TEXT,
ADD COLUMN IF NOT EXISTS target_date DATE,
ADD COLUMN IF NOT EXISTS current_activity_level TEXT,

-- Step 6: Emergency Contact
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,

-- Step 7: Enhanced Scheduling
ADD COLUMN IF NOT EXISTS preferred_days TEXT[], -- array of day IDs
ADD COLUMN IF NOT EXISTS sessions_per_week INTEGER,

-- Step 8: Legal Waivers & Consent
ADD COLUMN IF NOT EXISTS liability_waiver_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS photo_consent BOOLEAN DEFAULT FALSE,

-- Step 9: Payment
ADD COLUMN IF NOT EXISTS preferred_payment_method TEXT,

-- Step 10: Referral
ADD COLUMN IF NOT EXISTS referral_source TEXT,

-- Onboarding completion tracking
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_payment_model ON public.profiles(payment_model);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_package ON public.profiles(subscription_package);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON public.profiles(onboarding_completed_at);
CREATE INDEX IF NOT EXISTS idx_profiles_sessions_per_week ON public.profiles(sessions_per_week);

-- Add check constraints for data validation
ALTER TABLE public.profiles
ADD CONSTRAINT IF NOT EXISTS chk_height_positive CHECK (height IS NULL OR height > 0),
ADD CONSTRAINT IF NOT EXISTS chk_weight_positive CHECK (weight IS NULL OR weight > 0),
ADD CONSTRAINT IF NOT EXISTS chk_sessions_per_week_range CHECK (sessions_per_week IS NULL OR sessions_per_week BETWEEN 1 AND 7);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Enhanced onboarding profile columns added successfully!';
  RAISE NOTICE '📊 New fields: package, physical stats, medical, emergency contact, scheduling, legal, payment, referral';
  RAISE NOTICE '🔍 Indexes created for performance optimization';
END $$;

