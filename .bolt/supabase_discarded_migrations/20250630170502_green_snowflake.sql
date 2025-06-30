/*
  # Secure SQL functions

  1. Security Improvements
    - Add SECURITY DEFINER to all functions
    - Set search_path = public, pg_catalog for all functions
    - Update existing functions with proper security settings
  
  2. Functions Updated
    - is_admin()
    - is_alpha_member()
    - handle_new_user()
    - approve_application()
    - reject_application()
*/

-- Secure the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Create a function to check if user is an alpha member
CREATE OR REPLACE FUNCTION public.is_alpha_member()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_alpha = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Secure the handle_new_user function if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) THEN
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, name, is_alpha, is_admin)
      VALUES (
        new.id, 
        new.email, 
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
        false, 
        false
      );
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;
  END IF;
END $$;

-- Create approve_application function with proper security
CREATE OR REPLACE FUNCTION public.approve_application(application_id uuid)
RETURNS void AS $$
DECLARE
  app_email text;
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve applications';
  END IF;

  -- Get application email
  SELECT email INTO app_email
  FROM membership_applications
  WHERE id = application_id;

  IF app_email IS NULL THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Update application status
  UPDATE membership_applications
  SET status = 'approved'
  WHERE id = application_id;

  -- Update user's alpha status
  UPDATE profiles
  SET is_alpha = true
  WHERE email = app_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Create reject_application function with proper security
CREATE OR REPLACE FUNCTION public.reject_application(application_id uuid)
RETURNS void AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can reject applications';
  END IF;

  -- Update application status
  UPDATE membership_applications
  SET status = 'rejected'
  WHERE id = application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Add comment explaining the security improvements
COMMENT ON FUNCTION public.is_admin() IS 'Securely checks if the current user is an admin with SECURITY DEFINER and fixed search_path';
COMMENT ON FUNCTION public.is_alpha_member() IS 'Securely checks if the current user is an alpha member with SECURITY DEFINER and fixed search_path';
COMMENT ON FUNCTION public.approve_application(uuid) IS 'Securely approves an application and updates user status with SECURITY DEFINER and fixed search_path';
COMMENT ON FUNCTION public.reject_application(uuid) IS 'Securely rejects an application with SECURITY DEFINER and fixed search_path';