-- =====================================================
-- Onboarding Schema Verification Script
-- Run this in Supabase SQL Editor to verify all required columns exist
-- =====================================================

-- Check all onboarding-related columns
SELECT 
    column_name, 
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN (
        -- Payment & Package
        'payment_model',
        'subscription_package',
        'payment_setup_required',
        'payment_setup_status',
        
        -- Personal Info
        'first_name',
        'last_name',
        'phone',
        'city',
        'state',
        'date_of_birth',
        'gender',
        
        -- Physical Stats
        'height',
        'weight',
        'chest',
        'waist',
        'hips',
        
        -- Health & Medical
        'medical_conditions',
        'injuries',
        'medications',
        'doctor_clearance',
        
        -- Fitness Goals
        'specific_goal',
        'target_date',
        'current_activity_level',
        
        -- Emergency Contact
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        
        -- Scheduling
        'preferred_days',
        'sessions_per_week',
        
        -- Legal
        'liability_waiver_accepted',
        'terms_accepted',
        'photo_consent',
        
        -- Payment
        'preferred_payment_method',
        
        -- Referral
        'referral_source',
        
        -- Tracking
        'onboarding_completed_at'
    )
ORDER BY column_name;

-- Expected results:
-- - city: text
-- - state: text
-- - chest: numeric
-- - waist: numeric
-- - hips: numeric
-- - medical_conditions: ARRAY (udt_name: _text)
-- - preferred_days: ARRAY (udt_name: _text)
-- - payment_model: text
-- - subscription_package: text
-- - onboarding_completed_at: timestamp with time zone

-- If any columns are missing, they need to be added!

