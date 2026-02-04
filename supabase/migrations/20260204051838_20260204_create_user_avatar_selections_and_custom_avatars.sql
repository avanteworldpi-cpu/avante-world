/*
  # Create User Avatar Selections and Custom Avatars Tables
  
  1. New Tables
    - `user_avatar_selections`
      - `id` (uuid, primary key) - unique identifier for each selection
      - `user_id` (uuid, foreign key) - references auth.users
      - `selected_avatar_id` (uuid, foreign key, nullable) - references marketplace_avatars
      - `is_custom` (boolean) - indicates if it's a custom uploaded avatar
      - `custom_avatar_path` (text, nullable) - path to custom avatar in Storage (if is_custom=true)
      - `selected_at` (timestamp) - when avatar was selected
      - `updated_at` (timestamp) - last update time
    
    - `user_custom_avatars`
      - `id` (uuid, primary key) - unique identifier for each custom avatar
      - `user_id` (uuid, foreign key) - references auth.users
      - `filename` (text) - original filename
      - `storage_path` (text) - path in Supabase Storage
      - `file_type` (text) - 'glb' or 'gltf'
      - `file_size` (bigint) - file size in bytes
      - `uploaded_at` (timestamp) - when file was uploaded
      - `deleted_at` (timestamp, nullable) - soft delete timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for user_avatar_selections (users can read/write own)
    - Add policies for user_custom_avatars (users can read/write own)

  3. Important Notes
    - user_avatar_selections tracks current selection per user
    - user_custom_avatars tracks all uploaded files with soft delete capability
*/

-- Create user_avatar_selections table
CREATE TABLE IF NOT EXISTS user_avatar_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_avatar_id uuid REFERENCES marketplace_avatars(id) ON DELETE SET NULL,
  is_custom boolean DEFAULT false,
  custom_avatar_path text,
  selected_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_custom_avatars table
CREATE TABLE IF NOT EXISTS user_custom_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('glb', 'gltf')),
  file_size bigint NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Enable RLS on all tables
ALTER TABLE user_avatar_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_avatars ENABLE ROW LEVEL SECURITY;

-- user_avatar_selections policies
CREATE POLICY "Users can view own avatar selection"
  ON user_avatar_selections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar selection"
  ON user_avatar_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar selection"
  ON user_avatar_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_custom_avatars policies
CREATE POLICY "Users can view own custom avatars"
  ON user_custom_avatars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom avatars"
  ON user_custom_avatars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom avatars"
  ON user_custom_avatars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_avatar_selections_user_id ON user_avatar_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_avatars_user_id ON user_custom_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_avatars_deleted_at ON user_custom_avatars(deleted_at);