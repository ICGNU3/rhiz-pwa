/*
  # Add features column to membership_applications table

  1. Changes
     - Add a new `features` text column to the `membership_applications` table
     - This column will store user-requested features from the application form
*/

-- Add features column to membership_applications table
ALTER TABLE public.membership_applications 
ADD COLUMN IF NOT EXISTS features text;

-- Add comment to explain the column's purpose
COMMENT ON COLUMN public.membership_applications.features IS 'Features requested by the applicant';