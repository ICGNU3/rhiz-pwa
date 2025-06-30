/*
  # Add features column to membership_applications table

  1. Changes
    - Add `features` text column to the `membership_applications` table
    - This column will store user-requested features for the application
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'features'
  ) THEN
    ALTER TABLE public.membership_applications ADD COLUMN features text;
  END IF;
END $$;