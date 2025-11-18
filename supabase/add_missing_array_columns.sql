-- Add missing array columns to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS fitness_goals TEXT[],
ADD COLUMN IF NOT EXISTS preferred_workout_times TEXT[],
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[],
ADD COLUMN IF NOT EXISTS fitness_level TEXT;

-- Verify the columns exist
SELECT 
    column_name, 
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN ('fitness_goals', 'preferred_workout_times', 'dietary_restrictions', 'fitness_level')
ORDER BY column_name;

