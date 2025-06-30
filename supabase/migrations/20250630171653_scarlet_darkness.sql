/*
  # Fix profiles table policies

  1. Changes
     - Temporarily disable RLS on profiles table
     - Drop existing policies that might be causing conflicts
     - Recreate policies with proper conditions
     - Re-enable RLS
*/

-- Temporarily disable RLS on profiles
ALTER TABLE public.profiles
  DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

-- Recreate policies with proper conditions
CREATE POLICY "Users can read own profile" 
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" 
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Ensure is_admin function has proper security settings
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;