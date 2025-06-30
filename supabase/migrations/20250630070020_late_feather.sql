/*
  # Consolidate duplicate tables

  1. Changes
     - Merge `users` and `profiles` tables into a single `profiles` table
     - Keep `profiles` as the main user table linked to auth.users
     - Add missing columns from `users` to `profiles`
     - Update references and policies
     - Drop redundant `users` table

  2. Security
     - Maintain all existing RLS policies
     - Ensure proper foreign key relationships
*/

-- First, ensure profiles has all the columns from users
DO $$ 
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  -- Add is_alpha column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_alpha'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_alpha boolean DEFAULT false;
  END IF;

  -- Add is_admin column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create index on email if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'profiles' AND indexname = 'profiles_email_idx'
  ) THEN
    CREATE INDEX profiles_email_idx ON profiles(email);
  END IF;
END $$;

-- Migrate data from users to profiles
INSERT INTO profiles (id, email, name, is_alpha, is_admin, created_at, updated_at)
SELECT 
  u.id, 
  u.email, 
  u.name, 
  u.is_alpha, 
  u.is_admin, 
  u.created_at, 
  u.updated_at
FROM users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = COALESCE(profiles.name, EXCLUDED.name),
  is_alpha = COALESCE(profiles.is_alpha, EXCLUDED.is_alpha),
  is_admin = COALESCE(profiles.is_admin, EXCLUDED.is_admin),
  updated_at = now();

-- Update foreign keys to point to profiles instead of users
-- First, check if there are any foreign keys pointing to users
DO $$ 
BEGIN
  -- Update contacts foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'contacts_user_id_fkey'
  ) THEN
    ALTER TABLE contacts 
      DROP CONSTRAINT contacts_user_id_fkey,
      ADD CONSTRAINT contacts_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Update goals foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'goals_user_id_fkey'
  ) THEN
    ALTER TABLE goals 
      DROP CONSTRAINT goals_user_id_fkey,
      ADD CONSTRAINT goals_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Update user_settings foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_settings_user_id_fkey'
  ) THEN
    ALTER TABLE user_settings 
      DROP CONSTRAINT user_settings_user_id_fkey,
      ADD CONSTRAINT user_settings_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Update user_activities foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'user_activities_user_id_fkey'
  ) THEN
    ALTER TABLE user_activities 
      DROP CONSTRAINT user_activities_user_id_fkey,
      ADD CONSTRAINT user_activities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Update ai_chat_history foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ai_chat_history_user_id_fkey'
  ) THEN
    ALTER TABLE ai_chat_history 
      DROP CONSTRAINT ai_chat_history_user_id_fkey,
      ADD CONSTRAINT ai_chat_history_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Update trust_insights foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'trust_insights_user_id_fkey'
  ) THEN
    ALTER TABLE trust_insights 
      DROP CONSTRAINT trust_insights_user_id_fkey,
      ADD CONSTRAINT trust_insights_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

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

-- Drop the users table if it exists
DROP TABLE IF EXISTS users;

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

-- Update any code that references the users table to use profiles instead
COMMENT ON TABLE profiles IS 'User profiles table that extends auth.users with additional information';