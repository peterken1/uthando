-- Fix RLS Policy Issues
-- Run this in your Supabase SQL Editor

-- First, drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Add the is_admin column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create a simple, non-recursive admin policy
CREATE POLICY "Service role can manage all profiles" ON profiles
  FOR ALL USING (
    current_setting('role') = 'service_role'
  );

-- Allow users to view profiles if they are admin (non-recursive)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
    )
  );

-- Allow admins to update profiles (non-recursive)  
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
    )
  );

-- Now safely update your profile
UPDATE profiles 
SET credits = 999.00, is_admin = TRUE 
WHERE id = 'aecd5e10-7287-4d7a-a48a-a07e73a7f152';

-- Verify the update
SELECT id, email, full_name, credits, is_admin 
FROM profiles 
WHERE id = 'aecd5e10-7287-4d7a-a48a-a07e73a7f152';