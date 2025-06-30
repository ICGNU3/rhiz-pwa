/*
  # Alpha Application System

  1. New Tables
    - `membership_applications`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `organization` (text)
      - `vertical` (text)
      - `reason` (text)
      - `referral` (text, nullable)
      - `status` (text, default 'pending')
      - `created_at` (timestamp with time zone, default now())
  
  2. Schema Changes
    - Add `is_alpha` (boolean) to `users` table
    - Add `is_admin` (boolean) to `users` table
  
  3. Security
    - Enable RLS on `membership_applications` table
    - Add policies for application submission and admin access
*/

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

-- Add alpha and admin flags to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_alpha boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Enable RLS on membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Policies for membership_applications
-- Anyone can submit an application
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
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update applications
CREATE POLICY "Admins can update applications" 
  ON membership_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS membership_applications_email_idx ON membership_applications (email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS membership_applications_status_idx ON membership_applications (status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS membership_applications_created_at_idx ON membership_applications (created_at);

-- Create a function to check if a user is an admin
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

-- Create a function to check if a user is an alpha member
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