-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create an index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Make yourself an admin (replace with your actual user ID)
-- You can get your user ID from the Supabase dashboard or by checking your profile
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';

-- Create a function to safely promote users to admin (optional)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = TRUE 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to revoke admin access (optional)
CREATE OR REPLACE FUNCTION revoke_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = FALSE 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;