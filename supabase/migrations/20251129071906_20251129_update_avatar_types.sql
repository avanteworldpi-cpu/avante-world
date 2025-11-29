/*
  # Update Avatar Types Support

  1. Changes
    - Update user_avatars table CHECK constraint to accept new avatar types
    - Support additional avatar types: male_1, male_2, male_casual, female_1, female_2, female_casual, neutral_1, neutral_2
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'user_avatars' AND constraint_type = 'CHECK'
    AND constraint_name LIKE '%avatar_type%'
  ) THEN
    ALTER TABLE user_avatars DROP CONSTRAINT IF EXISTS user_avatars_avatar_type_check;
  END IF;
END $$;

ALTER TABLE user_avatars 
ADD CONSTRAINT user_avatars_avatar_type_check 
CHECK (avatar_type = ANY (ARRAY['male_1'::text, 'male_2'::text, 'male_casual'::text, 'female_1'::text, 'female_2'::text, 'female_casual'::text, 'neutral_1'::text, 'neutral_2'::text]));
