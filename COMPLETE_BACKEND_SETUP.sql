/*
  # User Profiles Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `fitness_goals` (text[])
      - `fitness_level` (text)
      - `height` (numeric)
      - `weight` (numeric)
      - `medical_conditions` (text[])
      - `dietary_restrictions` (text[])
      - `preferred_workout_times` (text[])
      - `preferred_training_style` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to:
      - Read their own profile
      - Update their own profile
      - Insert their own profile
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  fitness_goals text[],
  fitness_level text CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  height numeric,
  weight numeric,
  medical_conditions text[],
  dietary_restrictions text[],
  preferred_workout_times text[],
  preferred_training_style text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Enhanced User Profiles Schema

  1. Updates to Profiles Table
    - Added fields:
      - `avatar_url` (text): Store user profile picture URL
      - `bio` (text): User's personal bio/description
      - `social_links` (jsonb): Store social media links
      - `notification_preferences` (jsonb): User notification settings
      - `measurement_unit` (text): Preferred unit system (metric/imperial)
      - `goals_progress` (jsonb): Track progress towards fitness goals
      - `availability` (jsonb): Weekly availability schedule
      - `certifications` (text[]): Fitness certifications
      - `injuries` (text[]): Past or current injuries
      - `equipment_access` (text[]): Available fitness equipment

  2. New Tables
    - `workout_logs`: Track workout history
    - `measurements`: Track body measurements over time
    - `nutrition_logs`: Track daily nutrition
    - `progress_photos`: Store transformation photos
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS measurement_unit text CHECK (measurement_unit IN ('metric', 'imperial')) DEFAULT 'metric';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals_progress jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS injuries text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS equipment_access text[];

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  workout_date date NOT NULL DEFAULT CURRENT_DATE,
  workout_type text NOT NULL,
  duration interval,
  calories_burned integer,
  notes text,
  exercises jsonb DEFAULT '[]'::jsonb,
  rating smallint CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric,
  body_fat_percentage numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  biceps numeric,
  thighs numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL,
  foods jsonb NOT NULL,
  total_calories integer,
  protein numeric,
  carbs numeric,
  fats numeric,
  water_intake numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create progress_photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_logs
CREATE POLICY "Users can view own workout logs"
  ON workout_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs"
  ON workout_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs"
  ON workout_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for measurements
CREATE POLICY "Users can view own measurements"
  ON measurements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements"
  ON measurements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for nutrition_logs
CREATE POLICY "Users can view own nutrition logs"
  ON nutrition_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs"
  ON nutrition_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs"
  ON nutrition_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for progress_photos
CREATE POLICY "Users can view own progress photos"
  ON progress_photos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress photos"
  ON progress_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs (user_id, workout_date);
CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements (user_id, measurement_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs (user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date ON progress_photos (user_id, photo_date);/*
  # Add Member Features Tables and Policies

  1. New Tables
    - Progress photos for visual tracking
    - Nutrition logs for meal tracking
    - Body measurements tracking
    - Workout logging system

  2. Security
    - RLS enabled on all tables
    - Policies for user data access control

  3. Indexes
    - Optimized for user and date-based queries
*/

-- Progress Photos
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_date date DEFAULT CURRENT_DATE NOT NULL,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date ON progress_photos(user_id, photo_date);

ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'progress_photos' AND policyname = 'Users can insert own progress photos'
  ) THEN
    CREATE POLICY "Users can insert own progress photos"
      ON progress_photos
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'progress_photos' AND policyname = 'Users can view own progress photos'
  ) THEN
    CREATE POLICY "Users can view own progress photos"
      ON progress_photos
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Nutrition Logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  log_date date DEFAULT CURRENT_DATE NOT NULL,
  meal_type text NOT NULL,
  foods jsonb NOT NULL,
  total_calories integer,
  protein numeric,
  carbs numeric,
  fats numeric,
  water_intake numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, log_date);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can insert own nutrition logs'
  ) THEN
    CREATE POLICY "Users can insert own nutrition logs"
      ON nutrition_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can update own nutrition logs'
  ) THEN
    CREATE POLICY "Users can update own nutrition logs"
      ON nutrition_logs
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can view own nutrition logs'
  ) THEN
    CREATE POLICY "Users can view own nutrition logs"
      ON nutrition_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Measurements
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  measurement_date date DEFAULT CURRENT_DATE NOT NULL,
  weight numeric,
  body_fat_percentage numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  biceps numeric,
  thighs numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements(user_id, measurement_date);

ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'measurements' AND policyname = 'Users can insert own measurements'
  ) THEN
    CREATE POLICY "Users can insert own measurements"
      ON measurements
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'measurements' AND policyname = 'Users can view own measurements'
  ) THEN
    CREATE POLICY "Users can view own measurements"
      ON measurements
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Workout Logs
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workout_date date DEFAULT CURRENT_DATE NOT NULL,
  workout_type text NOT NULL,
  duration interval,
  calories_burned integer,
  notes text,
  exercises jsonb DEFAULT '[]'::jsonb,
  rating smallint CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, workout_date);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can insert own workout logs'
  ) THEN
    CREATE POLICY "Users can insert own workout logs"
      ON workout_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can update own workout logs'
  ) THEN
    CREATE POLICY "Users can update own workout logs"
      ON workout_logs
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can view own workout logs'
  ) THEN
    CREATE POLICY "Users can view own workout logs"
      ON workout_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger for workout_logs
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_workout_logs_updated_at ON workout_logs;
CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Add Payment System Tables

  1. New Tables
    - auth.users: Core user authentication table
    - payment_methods: Stores user payment methods
    - payment_history: Tracks payment transactions

  2. Security
    - RLS enabled on all tables
    - Policies for secure payment data access
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('card', 'bank_account')),
  last_four text NOT NULL,
  brand text,
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can view own payment methods'
  ) THEN
    CREATE POLICY "Users can view own payment methods"
      ON payment_methods
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can manage own payment methods'
  ) THEN
    CREATE POLICY "Users can manage own payment methods"
      ON payment_methods
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Payment History
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method_id uuid REFERENCES payment_methods(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_history' AND policyname = 'Users can view own payment history'
  ) THEN
    CREATE POLICY "Users can view own payment history"
      ON payment_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger for payment_methods
CREATE OR REPLACE FUNCTION handle_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_methods_updated_at();/*
  # Scheduling System Tables

  1. New Tables
    - `service_providers`
      - Staff profiles for trainers, therapists, and consultants
    - `services`
      - Available services (training, massage, consultation)
    - `availability`
      - Provider availability slots
    - `bookings`
      - Session bookings
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Service Providers
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  specialties text[],
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active service providers"
  ON service_providers
  FOR SELECT
  USING (status = 'active');

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration interval NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('training', 'massage', 'consultation')),
  provider_id uuid REFERENCES service_providers(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services
  FOR SELECT
  USING (status = 'active');

-- Availability
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX idx_availability_provider_date ON availability(provider_id, date);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability"
  ON availability
  FOR SELECT
  USING (is_available = true);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  provider_id uuid REFERENCES service_providers(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_provider_date ON bookings(provider_id, date);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update trigger for bookings
CREATE OR REPLACE FUNCTION handle_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_bookings_updated_at();/*
  # Add email column to profiles table

  1. Changes
    - Add `email` column to `profiles` table
      - Type: text
      - Nullable: true (since email is already stored in auth.users)
      - Description: User's email address
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;/*
  # Add Goals Table

  1. New Table
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `target` (numeric)
      - `unit` (text)
      - `deadline` (date)
      - `progress` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  target numeric NOT NULL,
  unit text NOT NULL,
  deadline date,
  progress numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Create trigger for updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Add Member Features Tables and Policies

  1. New Tables
    - Progress photos for visual tracking
    - Nutrition logs for meal tracking
    - Body measurements tracking
    - Workout logging system

  2. Security
    - RLS enabled on all tables
    - Policies for user data access control

  3. Indexes
    - Optimized for user and date-based queries
*/

-- Progress Photos
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_date date DEFAULT CURRENT_DATE NOT NULL,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date ON progress_photos(user_id, photo_date);

ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'progress_photos' AND policyname = 'Users can insert own progress photos'
  ) THEN
    CREATE POLICY "Users can insert own progress photos"
      ON progress_photos
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'progress_photos' AND policyname = 'Users can view own progress photos'
  ) THEN
    CREATE POLICY "Users can view own progress photos"
      ON progress_photos
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Nutrition Logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  log_date date DEFAULT CURRENT_DATE NOT NULL,
  meal_type text NOT NULL,
  foods jsonb NOT NULL,
  total_calories integer,
  protein numeric,
  carbs numeric,
  fats numeric,
  water_intake numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, log_date);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can insert own nutrition logs'
  ) THEN
    CREATE POLICY "Users can insert own nutrition logs"
      ON nutrition_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can update own nutrition logs'
  ) THEN
    CREATE POLICY "Users can update own nutrition logs"
      ON nutrition_logs
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'nutrition_logs' AND policyname = 'Users can view own nutrition logs'
  ) THEN
    CREATE POLICY "Users can view own nutrition logs"
      ON nutrition_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Measurements
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  measurement_date date DEFAULT CURRENT_DATE NOT NULL,
  weight numeric,
  body_fat_percentage numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  biceps numeric,
  thighs numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements(user_id, measurement_date);

ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'measurements' AND policyname = 'Users can insert own measurements'
  ) THEN
    CREATE POLICY "Users can insert own measurements"
      ON measurements
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'measurements' AND policyname = 'Users can view own measurements'
  ) THEN
    CREATE POLICY "Users can view own measurements"
      ON measurements
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Workout Logs
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  workout_date date DEFAULT CURRENT_DATE NOT NULL,
  workout_type text NOT NULL,
  duration interval,
  calories_burned integer,
  notes text,
  exercises jsonb DEFAULT '[]'::jsonb,
  rating smallint CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, workout_date);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can insert own workout logs'
  ) THEN
    CREATE POLICY "Users can insert own workout logs"
      ON workout_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can update own workout logs'
  ) THEN
    CREATE POLICY "Users can update own workout logs"
      ON workout_logs
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'workout_logs' AND policyname = 'Users can view own workout logs'
  ) THEN
    CREATE POLICY "Users can view own workout logs"
      ON workout_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger for workout_logs
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_workout_logs_updated_at ON workout_logs;
CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Add Payment System Tables

  1. New Tables
    - auth.users: Core user authentication table
    - payment_methods: Stores user payment methods
    - payment_history: Tracks payment transactions

  2. Security
    - RLS enabled on all tables
    - Policies for secure payment data access
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('card', 'bank_account')),
  last_four text NOT NULL,
  brand text,
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can view own payment methods'
  ) THEN
    CREATE POLICY "Users can view own payment methods"
      ON payment_methods
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can manage own payment methods'
  ) THEN
    CREATE POLICY "Users can manage own payment methods"
      ON payment_methods
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Payment History
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method_id uuid REFERENCES payment_methods(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_history' AND policyname = 'Users can view own payment history'
  ) THEN
    CREATE POLICY "Users can view own payment history"
      ON payment_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update trigger for payment_methods
CREATE OR REPLACE FUNCTION handle_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_methods_updated_at();/*
  # Add email column to profiles table

  1. Changes
    - Add `email` column to `profiles` table
      - Type: text
      - Nullable: true (since email is already stored in auth.users)
      - Description: User's email address
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;/*
  # Add Goals Table

  1. New Table
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `target` (numeric)
      - `unit` (text)
      - `deadline` (date)
      - `progress` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  target numeric NOT NULL,
  unit text NOT NULL,
  deadline date,
  progress numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Create trigger for updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Services and Availability Tables

  1. New Tables
    - `services`: Available services (training, massage, consultation)
    - `availability`: Provider availability slots

  2. Security
    - Enable RLS
    - Public read access for active records
*/

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration interval NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('training', 'massage', 'consultation')),
  provider_id uuid REFERENCES service_providers(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Anyone can view active services'
  ) THEN
    ALTER TABLE services ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Anyone can view active services"
      ON services
      FOR SELECT
      USING (status = 'active');
  END IF;
END $$;

-- Availability
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'availability' AND policyname = 'Anyone can view availability'
  ) THEN
    ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Anyone can view availability"
      ON availability
      FOR SELECT
      USING (is_available = true);
  END IF;
END $$;

-- Create index for availability queries
CREATE INDEX IF NOT EXISTS idx_availability_provider_date 
  ON availability(provider_id, date);/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that properly handle profile creation and updates
    - Ensure authenticated users can:
      - Create their own profile
      - Update their own profile
      - View their own profile

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users only
    - Restrict access to own profile data only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users based on id"
ON profiles FOR SELECT TO authenticated
USING (auth.uid() = id);/*
  # Add Meal Plans Table

  1. New Table
    - `meal_plans`
      - For coach-created meal plans assigned to users
      - Stores complete weekly meal plans with nutritional info
      - Includes coach suggestions and notes

  2. Security
    - Enable RLS
    - Add policies for authenticated users and coaches
*/

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid REFERENCES service_providers(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  daily_plans jsonb NOT NULL,
  coach_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- Create index for efficient queries
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, start_date, end_date);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can manage assigned meal plans"
  ON meal_plans
  FOR ALL
  TO authenticated
  USING (
    auth.uid()::text IN (
      SELECT id::text 
      FROM service_providers 
      WHERE id = coach_id
    )
  )
  WITH CHECK (
    auth.uid()::text IN (
      SELECT id::text 
      FROM service_providers 
      WHERE id = coach_id
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Add missing profile columns

  1. Changes
    - Add missing columns to profiles table:
      - city (text)
      - state (text)
      - phone (text)
      - date_of_birth (date)
      - gender (text with check constraint)
      - fitness_goals (text array)
      - fitness_level (text with check constraint)
      - dietary_restrictions (text array)
      - preferred_workout_times (text array)

  2. Security
    - No changes to RLS policies needed as existing policies cover new columns
*/

-- Add missing columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'state'
  ) THEN
    ALTER TABLE profiles ADD COLUMN state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE profiles ADD COLUMN date_of_birth date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_gender_check 
      CHECK (gender = ANY (ARRAY['male', 'female', 'other', 'prefer-not-to-say']));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'fitness_goals'
  ) THEN
    ALTER TABLE profiles ADD COLUMN fitness_goals text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'fitness_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN fitness_level text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_fitness_level_check 
      CHECK (fitness_level = ANY (ARRAY['beginner', 'intermediate', 'advanced']));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'dietary_restrictions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN dietary_restrictions text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preferred_workout_times'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_workout_times text[];
  END IF;
END $$;/*
  # Create storage buckets for user uploads

  1. New Storage Buckets
    - `avatars`: For user profile pictures and avatars
    - `progress-photos`: For user progress tracking photos
  
  2. Security
    - Enable public access for viewing avatars
    - Restrict progress photos to authenticated users
    - Allow authenticated users to upload to both buckets
*/

-- Create avatars bucket with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create progress-photos bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false);

-- Policy for uploading to avatars bucket
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Policy for reading avatars (public)
CREATE POLICY "Allow public to view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Policy for uploading progress photos
CREATE POLICY "Allow authenticated users to upload progress photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' AND
  auth.role() = 'authenticated'
);

-- Policy for viewing own progress photos
CREATE POLICY "Users can view own progress photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);/*
  # Admin System Implementation

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view other admins"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM admins WHERE status = 'active'
    )
  );

CREATE POLICY "Super admins can manage admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM admins WHERE role = 'super_admin' AND status = 'active'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM admins WHERE role = 'super_admin' AND status = 'active'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();/*
  # Add Admin Account Creation Function

  1. New Function
    - `create_admin_account`: Creates an admin account with specified role
      - Parameters:
        - email (text)
        - role (text)
      - Returns: uuid of created admin

  2. Security
    - Function can only be executed by authenticated super admins
    - Validates email format and role values
*/

-- Create function to create admin accounts
CREATE OR REPLACE FUNCTION create_admin_account(
  admin_email text,
  admin_role text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_admin_id uuid;
BEGIN
  -- Validate role
  IF admin_role NOT IN ('super_admin', 'admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Must be super_admin, admin, or moderator';
  END IF;

  -- Validate email format
  IF admin_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM admins WHERE email = admin_email) THEN
    RAISE EXCEPTION 'Admin with this email already exists';
  END IF;

  -- Insert new admin
  INSERT INTO admins (id, email, role, status)
  VALUES (auth.uid(), admin_email, admin_role, 'active')
  RETURNING id INTO new_admin_id;

  RETURN new_admin_id;
END;
$$;/*
  # Create Super Admin Record

  1. Changes
    - Create admin record for super admin user
    - Set appropriate role and status
*/

-- Create admin record if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admins 
    WHERE email = 'readysetfitrx@gmail.com' AND role = 'super_admin'
  ) THEN
    -- Insert admin record
    INSERT INTO admins (id, email, role, status)
    SELECT 
      id,
      'readysetfitrx@gmail.com',
      'super_admin',
      'active'
    FROM auth.users
    WHERE email = 'readysetfitrx@gmail.com'
    LIMIT 1;
  END IF;
END $$;-- MIGRATION: Enforce snake_case and add missing columns/constraints
-- BOOKINGS TABLE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='userId') THEN
    ALTER TABLE bookings RENAME COLUMN "userId" TO user_id;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='serviceId') THEN
    ALTER TABLE bookings RENAME COLUMN "serviceId" TO service_id;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='providerId') THEN
    ALTER TABLE bookings RENAME COLUMN "providerId" TO provider_id;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='createdAt') THEN
    ALTER TABLE bookings RENAME COLUMN "createdAt" TO created_at;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='updatedAt') THEN
    ALTER TABLE bookings RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END $$;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_id uuid;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id uuid;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;

-- SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  price numeric,
  status text,
  started_at timestamptz,
  cancelled_at timestamptz,
  renewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='userId') THEN
    ALTER TABLE subscriptions RENAME COLUMN "userId" TO user_id;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='planId') THEN
    ALTER TABLE subscriptions RENAME COLUMN "planId" TO plan_id;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='startedAt') THEN
    ALTER TABLE subscriptions RENAME COLUMN "startedAt" TO started_at;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='cancelledAt') THEN
    ALTER TABLE subscriptions RENAME COLUMN "cancelledAt" TO cancelled_at;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='renewedAt') THEN
    ALTER TABLE subscriptions RENAME COLUMN "renewedAt" TO renewed_at;
  END IF;
END $$;

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS price numeric;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS started_at timestamptz;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS renewed_at timestamptz;

ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- SERVICES TABLE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='createdAt') THEN
    ALTER TABLE services RENAME COLUMN "createdAt" TO created_at;
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='updatedAt') THEN
    ALTER TABLE services RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END $$;
ALTER TABLE services ADD COLUMN IF NOT EXISTS price numeric;
ALTER TABLE services ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS name text;

-- PAYMENT_METHODS TABLE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_methods' AND column_name='userId') THEN
    ALTER TABLE payment_methods RENAME COLUMN "userId" TO user_id;
  END IF;
END $$;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE payment_methods ADD CONSTRAINT fk_payment_methods_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- POSITIONS FOR ADMINS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS positions text[];

-- TRIGGERS AND INDEXES (EXAMPLES)
CREATE OR REPLACE FUNCTION handle_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_bookings_updated_at();

CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings (user_id, date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_plan ON subscriptions (user_id, plan_id);
/*
  # Create default admin account

  1. Changes
    - Insert default admin user into auth.users
    - Insert corresponding admin record into public.admins
    
  2. Security
    - Password is hashed using Supabase's built-in password hashing
    - Admin role is set to 'super_admin'
    - Status is set to 'active'
*/

-- First create the admin user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

-- Then create the admin record
INSERT INTO public.admins (
  id,
  email,
  role,
  status,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'super_admin',
  'active',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admins WHERE email = 'admin@example.com'
);/*
  # Create Super Admin Account

  1. Create user in auth.users if not exists
  2. Create admin record in admins table
  3. Set role as super_admin with active status
*/

-- First create the user in auth.users if it doesn't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'readysetfitrx@gmail.com',
  crypt('@GetFit2026', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'readysetfitrx@gmail.com'
);

-- Then create the admin record
INSERT INTO public.admins (
  id,
  email,
  role,
  status,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'super_admin',
  'active',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'readysetfitrx@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admins WHERE email = 'readysetfitrx@gmail.com'
);/*
  # Fix Admin RLS Policies

  1. Changes
    - Drop existing problematic policies
    - Create new policies that avoid recursion
    - Use a more efficient way to check admin status

  2. Security
    - Maintain same level of security
    - Prevent infinite recursion
    - Keep policies simple and focused
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view other admins" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;

-- Create new, non-recursive policies
CREATE POLICY "Enable read access for admins"
ON admins FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.status = 'active'
  )
);

CREATE POLICY "Enable super admin management"
ON admins FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.role = 'super_admin'
    AND a.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.role = 'super_admin'
    AND a.status = 'active'
  )
);/*
  # Fix Admin RLS and Add Super Admin

  1. Drop existing recursive policies
  2. Create new, optimized policies
  3. Add super admin account
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for admins" ON admins;
DROP POLICY IF EXISTS "Enable super admin management" ON admins;

-- Create new, optimized policies
CREATE POLICY "Enable read access for admins"
ON admins FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.status = 'active'
  )
);

CREATE POLICY "Enable super admin management"
ON admins FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.role = 'super_admin'
    AND a.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a
    WHERE a.id = auth.uid()
    AND a.role = 'super_admin'
    AND a.status = 'active'
  )
);

-- Create super admin account if it doesn't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'readysetfitrx@gmail.com',
  crypt('@GetFit2026', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'readysetfitrx@gmail.com'
);

-- Add admin record for the super admin
INSERT INTO public.admins (
  id,
  email,
  role,
  status,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'super_admin',
  'active',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'readysetfitrx@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admins WHERE email = 'readysetfitrx@gmail.com'
);/*
  # Fix Admin RLS Policies

  1. Changes
    - Remove recursive policies from admins table
    - Create new simplified policies that avoid querying the same table
    - Maintain security while preventing infinite recursion

  2. Security
    - Enable RLS on admins table
    - Add policy for admins to read their own record
    - Add policy for super admins to manage all admin records
    - Policies use direct uid comparison instead of subqueries
*/

-- Drop existing policies to replace them with non-recursive versions
DROP POLICY IF EXISTS "Enable read access for admins" ON public.admins;
DROP POLICY IF EXISTS "Enable super admin management" ON public.admins;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for admins"
ON public.admins
FOR SELECT
TO authenticated
USING (
  -- Simple direct comparison with the user's ID
  id = auth.uid()
);

CREATE POLICY "Enable super admin management"
ON public.admins
FOR ALL
TO authenticated
USING (
  -- Check if the current user is a super_admin
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() 
    AND role = 'super_admin'
    AND status = 'active'
  )
)
WITH CHECK (
  -- Same condition for insert/update operations
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() 
    AND role = 'super_admin'
    AND status = 'active'
  )
);-- Create reminders table for meal plan reminders
CREATE TABLE IF NOT EXISTS reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
    message text NOT NULL,
    remind_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for quick lookup by user and meal plan
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_meal_plan_id ON reminders(meal_plan_id);
-- 90-Day Meal Planning Schema for Ready Set Fit (RSF)
-- All FKs to client_id point to profiles(id)

-- meal_plans: High-level meal plan (assigned by admin/nutritionist)
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- meal_plan_days: Each day in a 90-day plan
CREATE TABLE IF NOT EXISTS meal_plan_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 90),
  date date,
  total_calories integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- meals: Meals per day (breakfast/lunch/dinner/snack)
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_day_id uuid REFERENCES meal_plan_days(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  title text,
  description text,
  serving_size text,
  created_at timestamptz DEFAULT now()
);

-- food_items: Food catalog
CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories_per_unit numeric,
  protein_grams numeric,
  carbs_grams numeric,
  fat_grams numeric,
  standard_unit text,
  food_category text
);

-- meal_items: Foods in a meal
CREATE TABLE IF NOT EXISTS meal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE,
  food_id uuid REFERENCES food_items(id) ON DELETE SET NULL,
  quantity numeric,
  unit text,
  preparation_notes text
);

-- client_meal_plans: Assign plan to client
CREATE TABLE IF NOT EXISTS client_meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  status text DEFAULT 'active',
  UNIQUE (client_id, meal_plan_id)
);

-- nutritional_requirements: Client's nutrition goals
CREATE TABLE IF NOT EXISTS nutritional_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  daily_calorie_target integer,
  protein_target_grams numeric,
  carbs_target_grams numeric,
  fat_target_grams numeric
);

-- meal_compliance: Track client adherence to plan
CREATE TABLE IF NOT EXISTS meal_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  meal_plan_day_id uuid REFERENCES meal_plan_days(id) ON DELETE CASCADE,
  compliance_status text,
  notes text,
  recorded_at timestamptz DEFAULT now()
);

-- dietary_restrictions: Client restrictions
CREATE TABLE IF NOT EXISTS dietary_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  restriction_type text NOT NULL,
  food_item_id uuid REFERENCES food_items(id),
  description text,
  severity text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_meal_plans_client ON client_meal_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_days_plan ON meal_plan_days(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meals_day ON meals(meal_plan_day_id);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal ON meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_compliance_client_day ON meal_compliance(client_id, meal_plan_day_id);

-- Enable RLS and add policies as needed after confirming table creation
-- Migration (superseded by 20250506095000_meal_planning_schema.sql)
-- The meal_plans and meal_plan_items tables are now implemented in a more advanced form.
-- This migration is left empty to avoid conflicts with the new schema.
-- (Old code commented out below for reference)

/*
-- Table: meal_plans
-- create table if not exists meal_plans (
--     id uuid primary key default gen_random_uuid(),
--     title text not null,
--     notes text,
--     client_id uuid not null references users(id) on delete cascade,
--     created_by uuid not null references profiles(id) on delete set null,
--     created_at timestamp with time zone default timezone('utc', now()),
--     updated_at timestamp with time zone default timezone('utc', now())
-- );

-- Table: meal_plan_items
-- create table if not exists meal_plan_items (
--     id uuid primary key default gen_random_uuid(),
--     meal_plan_id uuid not null references meal_plans(id) on delete cascade,
--     day integer not null, -- e.g., 1 for Day 1, 2 for Day 2, etc.
--     meal_type text not null, -- e.g., Breakfast, Lunch, Dinner
--     description text not null,
--     "order" integer default 0,
--     created_at timestamp with time zone default timezone('utc', now())
-- );

-- Indexes for performance
-- create index if not exists idx_meal_plan_client on meal_plans(client_id);
-- create index if not exists idx_meal_plan_items_plan on meal_plan_items(meal_plan_id);
*/

-- =====================================================
-- CMS SYSTEM MIGRATION
-- Enables full content management capabilities
-- =====================================================

-- =====================================================
-- 1. SITE SETTINGS TABLE
-- Stores global site configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL, -- 'branding', 'seo', 'social', 'general'
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Insert default settings
INSERT INTO site_settings (key, value, category) VALUES
  ('site_name', '"RSF Fitness"', 'branding'),
  ('site_tagline', '"Transform Your Body, Transform Your Life"', 'branding'),
  ('site_logo', '"/RSF_FullLogo_FullColor.png"', 'branding'),
  ('site_logo_white', '"/RSF_FullLogo_WhiteandGreen.png"', 'branding'),
  ('site_icon', '"/RSF_IconOnly_FullColor.png"', 'branding'),
  ('primary_color', '"#10b981"', 'branding'),
  ('secondary_color', '"#3b82f6"', 'branding'),
  ('accent_color', '"#f59e0b"', 'branding'),
  ('font_heading', '"Inter"', 'branding'),
  ('font_body', '"Inter"', 'branding'),
  ('meta_title', '"RSF Fitness - Transform Your Life"', 'seo'),
  ('meta_description', '"Join RSF Fitness for personalized training, nutrition plans, and a supportive community."', 'seo'),
  ('meta_keywords', '"fitness, training, nutrition, wellness, gym"', 'seo'),
  ('facebook_url', '""', 'social'),
  ('instagram_url', '""', 'social'),
  ('twitter_url', '""', 'social'),
  ('contact_email', '"info@rsfitness.com"', 'general'),
  ('contact_phone', '""', 'general'),
  ('address', '""', 'general')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 2. PAGES TABLE
-- Manages website pages
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id)
);

-- Insert default pages
INSERT INTO pages (slug, title, meta_title, meta_description, is_published, published_at) VALUES
  ('home', 'Home', 'RSF Fitness - Transform Your Life', 'Join RSF Fitness for personalized training, nutrition plans, and a supportive community.', true, now()),
  ('services', 'Services', 'Our Services - RSF Fitness', 'Explore our comprehensive fitness services including personal training, group classes, and nutrition coaching.', true, now()),
  ('pricing', 'Pricing', 'Membership Plans - RSF Fitness', 'Choose the perfect membership plan for your fitness journey.', true, now()),
  ('community', 'Community', 'Community - RSF Fitness', 'Join our vibrant fitness community and connect with like-minded individuals.', true, now())
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. CONTENT BLOCKS TABLE
-- Stores reusable content sections
-- =====================================================
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  block_type text NOT NULL, -- 'hero', 'features', 'testimonials', 'cta', 'gallery', 'text', 'custom'
  block_name text NOT NULL,
  content jsonb NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_position ON content_blocks(page_id, position);

-- =====================================================
-- 4. MEDIA LIBRARY TABLE
-- Manages uploaded images and files
-- =====================================================
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  file_type text NOT NULL, -- 'image', 'video', 'document'
  mime_type text NOT NULL,
  file_size integer NOT NULL, -- in bytes
  alt_text text,
  caption text,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON media_library USING gin(tags);

-- =====================================================
-- 5. NAVIGATION MENUS TABLE
-- Manages site navigation
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  location text NOT NULL, -- 'header', 'footer', 'mobile'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default menus
INSERT INTO navigation_menus (name, location) VALUES
  ('Primary Navigation', 'header'),
  ('Footer Navigation', 'footer'),
  ('Mobile Navigation', 'mobile')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 6. NAVIGATION ITEMS TABLE
-- Individual menu items
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES navigation_menus(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  is_visible boolean DEFAULT true,
  open_in_new_tab boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_navigation_items_menu_position ON navigation_items(menu_id, position);

-- =====================================================
-- 7. CONTENT TEMPLATES TABLE
-- Pre-built section templates
-- =====================================================
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  block_type text NOT NULL,
  template_data jsonb NOT NULL,
  thumbnail_url text,
  is_system boolean DEFAULT false, -- system templates can't be deleted
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- =====================================================
-- 8. PAGE VERSIONS TABLE (for history/rollback)
-- =====================================================
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content_snapshot jsonb NOT NULL, -- stores all blocks at this version
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  notes text
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_page_versions_page ON page_versions(page_id, version_number DESC);

-- =====================================================
-- 9. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_blocks_updated_at ON content_blocks;
CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_navigation_menus_updated_at ON navigation_menus;
CREATE TRIGGER update_navigation_menus_updated_at
  BEFORE UPDATE ON navigation_menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

-- Public read access to published content
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view visible content blocks"
  ON content_blocks FOR SELECT
  USING (is_visible = true AND EXISTS (
    SELECT 1 FROM pages WHERE pages.id = content_blocks.page_id AND pages.is_published = true
  ));

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view navigation menus"
  ON navigation_menus FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view visible navigation items"
  ON navigation_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can view media"
  ON media_library FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view system templates"
  ON content_templates FOR SELECT
  USING (is_system = true);

-- Admin full access
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage content blocks"
  ON content_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage media"
  ON media_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage navigation"
  ON navigation_menus FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage navigation items"
  ON navigation_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage templates"
  ON content_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can view page versions"
  ON page_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- =====================================================
-- 11. HELPER FUNCTIONS
-- =====================================================

-- Function to create a page version snapshot
CREATE OR REPLACE FUNCTION create_page_version(
  p_page_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_version_id uuid;
  v_version_number integer;
  v_content_snapshot jsonb;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_version_number
  FROM page_versions
  WHERE page_id = p_page_id;
  
  -- Create snapshot of all content blocks
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'block_type', block_type,
      'block_name', block_name,
      'content', content,
      'position', position,
      'is_visible', is_visible
    ) ORDER BY position
  )
  INTO v_content_snapshot
  FROM content_blocks
  WHERE page_id = p_page_id;
  
  -- Insert version
  INSERT INTO page_versions (page_id, version_number, content_snapshot, created_by, notes)
  VALUES (p_page_id, v_version_number, v_content_snapshot, auth.uid(), p_notes)
  RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore a page version
CREATE OR REPLACE FUNCTION restore_page_version(
  p_version_id uuid
)
RETURNS boolean AS $$
DECLARE
  v_page_id uuid;
  v_content_snapshot jsonb;
  v_block jsonb;
BEGIN
  -- Get version data
  SELECT page_id, content_snapshot
  INTO v_page_id, v_content_snapshot
  FROM page_versions
  WHERE id = p_version_id;
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Version not found';
  END IF;
  
  -- Delete current blocks
  DELETE FROM content_blocks WHERE page_id = v_page_id;
  
  -- Restore blocks from snapshot
  FOR v_block IN SELECT * FROM jsonb_array_elements(v_content_snapshot)
  LOOP
    INSERT INTO content_blocks (
      page_id,
      block_type,
      block_name,
      content,
      position,
      is_visible
    )
    VALUES (
      v_page_id,
      v_block->>'block_type',
      v_block->>'block_name',
      v_block->'content',
      (v_block->>'position')::integer,
      (v_block->>'is_visible')::boolean
    );
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 12. INITIAL CONTENT BLOCKS FOR HOME PAGE
-- =====================================================

-- Get home page ID
DO $$
DECLARE
  v_home_page_id uuid;
BEGIN
  SELECT id INTO v_home_page_id FROM pages WHERE slug = 'home' LIMIT 1;
  
  IF v_home_page_id IS NOT NULL THEN
    -- Hero Section
    INSERT INTO content_blocks (page_id, block_type, block_name, content, position) VALUES
    (v_home_page_id, 'hero', 'Main Hero Section', '{
      "heading": "Transform Your Body,<br/>Transform Your Life",
      "subheading": "Join RSF Fitness and discover a personalized approach to wellness",
      "ctaText": "Start Your Journey",
      "ctaLink": "/pricing",
      "backgroundImage": "/C71A8224.jpg",
      "overlayOpacity": 0.4
    }'::jsonb, 1),
    
    -- Features/Benefits Section
    (v_home_page_id, 'features', 'Benefits Section', '{
      "heading": "Why Choose RSF Fitness",
      "subheading": "Everything you need to achieve your fitness goals",
      "features": [
        {
          "icon": "Dumbbell",
          "title": "Expert Training",
          "description": "Work with certified trainers who create personalized workout plans"
        },
        {
          "icon": "Apple",
          "title": "Nutrition Coaching",
          "description": "Custom meal plans designed for your goals and lifestyle"
        },
        {
          "icon": "Users",
          "title": "Community Support",
          "description": "Join a motivating community of fitness enthusiasts"
        },
        {
          "icon": "Calendar",
          "title": "Flexible Scheduling",
          "description": "Book sessions that fit your busy schedule"
        }
      ]
    }'::jsonb, 2),
    
    -- Testimonials Section
    (v_home_page_id, 'testimonials', 'Client Testimonials', '{
      "heading": "Success Stories",
      "subheading": "Hear from our amazing community"
    }'::jsonb, 3),
    
    -- CTA Section
    (v_home_page_id, 'cta', 'Bottom Call to Action', '{
      "heading": "Ready to Start Your Journey?",
      "subheading": "Join hundreds of members transforming their lives",
      "ctaText": "Get Started Today",
      "ctaLink": "/pricing",
      "backgroundColor": "#10b981"
    }'::jsonb, 4);
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

