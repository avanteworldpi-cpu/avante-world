/*
  # Add custom avatar URL support
  
  1. Modified Tables
    - `user_avatars`
      - Added `custom_avatar_url` (text, nullable) - stores Ready Player Me custom avatar URLs
      - This allows users to use their custom avatars created via the RPM iframe
  
  2. Changes
    - New column for storing custom RPM avatar URLs
    - Allows both preset avatars and fully custom avatars
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_avatars' AND column_name = 'custom_avatar_url'
  ) THEN
    ALTER TABLE user_avatars ADD COLUMN custom_avatar_url text DEFAULT NULL;
  END IF;
END $$;
