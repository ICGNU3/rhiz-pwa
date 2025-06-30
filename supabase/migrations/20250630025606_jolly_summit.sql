/*
  # Alpha Application System Migration

  1. New Tables
    - `membership_applications` - stores alpha application submissions
    - Creates or updates `users` table with alpha/admin flags

  2. Security
    - Enable RLS on membership_applications table
    - Add policies for application submission and admin review
    - Create helper functions for admin and alpha checks

  3. Indexes
    - Add indexes for performance on email, status, and created_at
*/

-- First, create the users table if it doesn't exist (for Supabase Auth integration)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add alpha and admin flags to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_alpha'
  ) THEN
    ALTER TABLE users ADD COLUMN is_alpha boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

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

-- Create helper functions first (before policies that use them)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_alpha_member()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_alpha = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for users table
CREATE POLICY "Users can read own data" 
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for membership_applications
-- Anyone can submit an application (even unauthenticated users)
CREATE POLICY "Anyone can submit an application" 
  ON membership_applications
  FOR INSERT
  TO public
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
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- Insert a default admin user (you can update this email to your own)
INSERT INTO users (email, name, is_admin, is_alpha)
VALUES ('admin@rhiz.app', 'Admin User', true, true)
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  is_alpha = true;