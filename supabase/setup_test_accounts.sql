-- =====================================================
-- Setup Test Accounts for Development
-- =====================================================
-- Run this script to set up test accounts with proper roles
-- These accounts match the Dev Login page credentials
-- =====================================================

-- Note: Accounts must be created through Supabase Auth first
-- The Dev Login page will auto-create them if they don't exist

-- After accounts are created via Auth, update their profiles:

-- 1. Client Test Account (rsf.client.test@gmail.com)
UPDATE profiles 
SET 
    role = 'user',
    first_name = 'Test',
    last_name = 'Client',
    subscription_package = 'pro',
    payment_model = 'subscription',
    onboarding_completed_at = NOW()
WHERE email = 'rsf.client.test@gmail.com';

-- 2. Admin Test Account (rsf.admin.test@gmail.com)
UPDATE profiles 
SET 
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    onboarding_completed_at = NOW()
WHERE email = 'rsf.admin.test@gmail.com';

-- 3. New User Test Account (rsf.newuser.test@gmail.com)
-- Leave as is - should go through onboarding
UPDATE profiles 
SET 
    role = 'user',
    first_name = 'New',
    last_name = 'User',
    onboarding_completed_at = NULL
WHERE email = 'rsf.newuser.test@gmail.com';

-- Verify the accounts
SELECT 
    email,
    role,
    first_name,
    last_name,
    subscription_package,
    onboarding_completed_at IS NOT NULL as onboarding_done
FROM profiles 
WHERE email IN ('rsf.client.test@gmail.com', 'rsf.admin.test@gmail.com', 'rsf.newuser.test@gmail.com');

