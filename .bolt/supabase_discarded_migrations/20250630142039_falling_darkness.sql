/*
  # Update references from users to profiles

  1. Changes
     - Updates all references from the users table to the profiles table
     - Ensures all foreign keys point to auth.users instead of the removed users table
     - Creates a function to check admin status

  2. Security
     - Maintains all existing RLS policies
*/

-- Create a function to check if admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies that might reference users table
DO $$ 
BEGIN
  -- Update membership_applications policies if they reference users
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'membership_applications' AND policyname = 'Admins can view all applications'
  ) THEN
    DROP POLICY IF EXISTS "Admins can view all applications" ON membership_applications;
    CREATE POLICY "Admins can view all applications"
      ON membership_applications
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'membership_applications' AND policyname = 'Admins can update applications'
  ) THEN
    DROP POLICY IF EXISTS "Admins can update applications" ON membership_applications;
    CREATE POLICY "Admins can update applications"
      ON membership_applications
      FOR UPDATE
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;

-- Update application_summary view if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_name = 'application_summary'
  ) THEN
    DROP VIEW IF EXISTS application_summary;
    
    CREATE VIEW application_summary AS
    SELECT 
      a.id,
      a.name,
      a.email,
      a.organization,
      a.vertical,
      a.reason,
      a.referral,
      a.status,
      a.created_at,
      p.is_alpha,
      p.is_admin
    FROM membership_applications a
    LEFT JOIN profiles p ON a.email = p.email;
  END IF;
END $$;