-- Temporary fix: Disable RLS to bypass policy issues
-- Run this in your Supabase SQL Editor

-- Disable RLS on profiles table temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Add the is_admin column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update your profile with credits and admin status
UPDATE profiles 
SET credits = 999.00, is_admin = TRUE 
WHERE id = 'aecd5e10-7287-4d7a-a48a-a07e73a7f152';

-- Verify the update worked
SELECT id, email, full_name, credits, is_admin 
FROM profiles 
WHERE id = 'aecd5e10-7287-4d7a-a48a-a07e73a7f152';