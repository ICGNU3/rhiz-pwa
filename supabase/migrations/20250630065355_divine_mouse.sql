/*
  # Add Admin User

  1. User Creation
    - Adds a user with email 'isrealdeep@gmail.com'
    - Sets both is_alpha and is_admin flags to TRUE
    - Creates or updates corresponding profile entry
  
  2. Security
    - Handles cases where user might already exist
    - Updates existing records if needed
*/

-- Check if user already exists in auth.users
DO $$
DECLARE
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Check if user exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'isrealdeep@gmail.com'
  ) INTO user_exists;

  IF NOT user_exists THEN
    -- Insert into public.users table
    INSERT INTO public.users (
      email,
      name,
      is_alpha,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      'isrealdeep@gmail.com',
      'Admin User',
      TRUE,
      TRUE,
      now(),
      now()
    );
  ELSE
    -- Get the user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'isrealdeep@gmail.com';
    
    -- Update existing user in public.users
    UPDATE public.users
    SET 
      is_alpha = TRUE,
      is_admin = TRUE,
      updated_at = now()
    WHERE email = 'isrealdeep@gmail.com';
    
    -- If user doesn't exist in public.users, insert them
    IF NOT FOUND THEN
      INSERT INTO public.users (
        id,
        email,
        name,
        is_alpha,
        is_admin,
        created_at,
        updated_at
      ) VALUES (
        user_id,
        'isrealdeep@gmail.com',
        'Admin User',
        TRUE,
        TRUE,
        now(),
        now()
      );
    END IF;
  END IF;
END $$;

-- Create a profile for the user if it doesn't exist
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users or public.users
  SELECT id INTO user_id FROM public.users WHERE email = 'isrealdeep@gmail.com';
  
  IF user_id IS NOT NULL THEN
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
      -- Insert profile
      INSERT INTO public.profiles (
        id,
        email,
        name,
        is_alpha,
        is_admin,
        created_at,
        updated_at
      ) VALUES (
        user_id,
        'isrealdeep@gmail.com',
        'Admin User',
        TRUE,
        TRUE,
        now(),
        now()
      );
    ELSE
      -- Update existing profile
      UPDATE public.profiles
      SET 
        is_alpha = TRUE,
        is_admin = TRUE,
        updated_at = now()
      WHERE id = user_id;
    END IF;
  END IF;
END $$;