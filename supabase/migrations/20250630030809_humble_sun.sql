/*
  # Alpha Program Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `is_alpha` (boolean, default false)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `membership_applications`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `organization` (text, required)
      - `vertical` (text, required)
      - `reason` (text, required)
      - `referral` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add admin-only policies for application management

  3. Functions
    - `is_admin()` - Check if current user is admin
    - `is_alpha_member()` - Check if current user has alpha access
    - `handle_new_user()` - Auto-create profile for new users
    - `approve_application()` - Approve membership application
    - `reject_application()` - Reject membership application

  4. Views
    - `application_summary` - Combined view of applications and user profiles
*/

-- First, completely clean up any existing objects
-- Drop all policies explicitly by name
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on membership_applications
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'membership_applications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON membership_applications';
    END LOOP;
    
    -- Drop all policies on profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
    
    -- Drop all policies on application_summary view
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'application_summary') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON application_summary';
    END LOOP;
EXCEPTION
    WHEN undefined_table THEN
        NULL; -- Table doesn't exist yet, continue
    WHEN undefined_object THEN
        NULL; -- Policy doesn't exist, continue
END $$;

-- Drop view first (it might depend on functions)
DROP VIEW IF EXISTS application_summary;

-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions with CASCADE to remove any remaining dependencies
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_alpha_member() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS approve_application(text) CASCADE;
DROP FUNCTION IF EXISTS reject_application(text) CASCADE;

-- Drop tables if they exist (this will remove any remaining policies)
DROP TABLE IF EXISTS membership_applications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Now create everything fresh

-- Create profiles table to extend Supabase auth.users
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  name text,
  is_alpha boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create membership_applications table
CREATE TABLE membership_applications (
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
CREATE VIEW application_summary AS
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

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
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

-- Create policies for membership_applications
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

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for performance
CREATE INDEX membership_applications_email_idx ON membership_applications (email);
CREATE INDEX membership_applications_status_idx ON membership_applications (status);
CREATE INDEX membership_applications_created_at_idx ON membership_applications (created_at);
CREATE INDEX profiles_email_idx ON profiles (email);
CREATE INDEX profiles_is_alpha_idx ON profiles (is_alpha);
CREATE INDEX profiles_is_admin_idx ON profiles (is_admin);

-- Create a default admin user (update this email to your own)
-- This will only work if you manually create a user with this email first
-- through Supabase Auth, then run this to grant admin privileges
DO $$
BEGIN
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