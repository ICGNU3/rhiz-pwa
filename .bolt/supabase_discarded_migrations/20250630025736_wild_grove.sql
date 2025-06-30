/*
  # Alpha Application System Migration

  1. New Tables
    - `membership_applications` - stores alpha application submissions
  
  2. Auth Extensions
    - Extends auth.users with is_alpha and is_admin flags via profiles table
    
  3. Security
    - Enable RLS on all tables
    - Add policies for application submission and admin management
    - Create helper functions for role checking
*/

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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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

-- Grant access to the view for admins
CREATE POLICY "Admins can view application summary" 
  ON application_summary
  FOR SELECT
  TO authenticated
  USING (is_admin());