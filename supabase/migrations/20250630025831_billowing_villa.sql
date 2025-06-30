/*
  # Alpha Application System Migration

  1. New Tables
    - `profiles` - Extends Supabase auth.users with alpha/admin flags
    - `membership_applications` - Stores alpha application requests

  2. Security
    - Enable RLS on both tables
    - Policies for application submission and admin management
    - Helper functions for role checking and application processing

  3. Features
    - Automatic profile creation for new users
    - Application approval/rejection functions
    - Admin view for application management
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies on membership_applications if they exist
  DROP POLICY IF EXISTS "Anyone can submit an application" ON membership_applications;
  DROP POLICY IF EXISTS "Users can view their own applications" ON membership_applications;
  DROP POLICY IF EXISTS "Admins can view all applications" ON membership_applications;
  DROP POLICY IF EXISTS "Admins can update applications" ON membership_applications;
  
  -- Drop policies on profiles if they exist
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can view application summary" ON application_summary;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- Table doesn't exist yet, continue
  WHEN undefined_object THEN
    NULL; -- Policy doesn't exist, continue
END $$;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_alpha_member();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS approve_application(text);
DROP FUNCTION IF EXISTS reject_application(text);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing view if it exists
DROP VIEW IF EXISTS application_summary;

-- Create profiles table to extend Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  name text,
  is_alpha boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  vertical text NOT NULL,
  reason text NOT NULL,
  referral text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_alpha_member()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_alpha = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Policies for profiles table
CREATE POLICY "Users can read own profile" 
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" 
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles" 
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Policies for membership_applications
-- Anyone can submit an application (even unauthenticated users)
CREATE POLICY "Anyone can submit an application" 
  ON membership_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own applications
CREATE POLICY "Users can view their own applications" 
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Only admins can view all applications
CREATE POLICY "Admins can view all applications" 
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Only admins can update applications
CREATE POLICY "Admins can update applications" 
  ON membership_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS membership_applications_email_idx ON membership_applications (email);
CREATE INDEX IF NOT EXISTS membership_applications_status_idx ON membership_applications (status);
CREATE INDEX IF NOT EXISTS membership_applications_created_at_idx ON membership_applications (created_at);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);
CREATE INDEX IF NOT EXISTS profiles_is_alpha_idx ON profiles (is_alpha);
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON profiles (is_admin);

-- Function to approve an application and grant alpha access
CREATE OR REPLACE FUNCTION approve_application(application_email text)
RETURNS void AS $$
BEGIN
  -- Update application status
  UPDATE membership_applications 
  SET status = 'approved' 
  WHERE email = application_email;
  
  -- Grant alpha access to user if they exist
  UPDATE profiles 
  SET is_alpha = true 
  WHERE email = application_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject an application
CREATE OR REPLACE FUNCTION reject_application(application_email text)
RETURNS void AS $$
BEGIN
  UPDATE membership_applications 
  SET status = 'rejected' 
  WHERE email = application_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easy application management
CREATE OR REPLACE VIEW application_summary AS
SELECT 
  ma.id,
  ma.name,
  ma.email,
  ma.organization,
  ma.vertical,
  ma.reason,
  ma.referral,
  ma.status,
  ma.created_at,
  p.is_alpha,
  p.is_admin
FROM membership_applications ma
LEFT JOIN profiles p ON ma.email = p.email;

-- Create a default admin user (update this email to your own)
DO $$
BEGIN
  -- This will only work if you manually create a user with this email first
  -- through Supabase Auth, then run this to grant admin privileges
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@rhiz.app') THEN
    INSERT INTO profiles (id, email, name, is_admin, is_alpha)
    SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Admin User'), true, true
    FROM auth.users 
    WHERE email = 'admin@rhiz.app'
    ON CONFLICT (id) DO UPDATE SET
      is_admin = true,
      is_alpha = true;
  END IF;
END $$;