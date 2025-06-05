-- Migration 005: Add auth integration to subscribers table
-- Run this on both DEV and PROD Supabase instances

-- Add auth_user_id column to link with Supabase auth
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_auth_user_id 
ON subscribers(auth_user_id) 
WHERE auth_user_id IS NOT NULL;

-- Update RLS policies to work with authenticated users
DROP POLICY IF EXISTS "Allow users to read own data" ON subscribers;
DROP POLICY IF EXISTS "Allow users to update own data" ON subscribers;

-- Allow authenticated users to read their own data
CREATE POLICY "Allow users to read own data" ON subscribers
  FOR SELECT 
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Allow authenticated users to update their own data
CREATE POLICY "Allow users to update own data" ON subscribers
  FOR UPDATE 
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Allow authenticated users to insert their own data
CREATE POLICY "Allow users to insert own data" ON subscribers
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Function to automatically set auth_user_id on insert
CREATE OR REPLACE FUNCTION set_auth_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set auth_user_id if it's not already set and user is authenticated
  IF NEW.auth_user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.auth_user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set auth_user_id
DROP TRIGGER IF EXISTS set_subscriber_auth_user_id ON subscribers;
CREATE TRIGGER set_subscriber_auth_user_id
  BEFORE INSERT ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION set_auth_user_id();

-- Update the existing public subscription policy to work with both auth and anon users
DROP POLICY IF EXISTS "Allow public subscription" ON subscribers;
CREATE POLICY "Allow public subscription" ON subscribers
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (
    -- Anonymous users can only insert without auth_user_id
    (auth.role() = 'anon' AND auth_user_id IS NULL) OR
    -- Authenticated users can only insert with their own auth_user_id
    (auth.role() = 'authenticated' AND auth_user_id = auth.uid())
  ); 