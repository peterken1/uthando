-- Complete Database Setup for Uthando App
-- Run this in your Supabase SQL Editor

-- First, add the is_admin column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create an index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Ensure the deduct_credits function exists and works properly
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id UUID, amount DECIMAL, feature TEXT, description TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits DECIMAL;
  has_premium BOOLEAN;
BEGIN
  -- Check if user has premium access
  SELECT (premium_until IS NOT NULL AND premium_until > NOW()) INTO has_premium 
  FROM profiles WHERE id = user_id;
  
  -- If user has premium, don't deduct credits but log usage
  IF has_premium THEN
    INSERT INTO usage_logs (user_id, feature, credits_used)
    VALUES (user_id, feature, 0);
    RETURN TRUE;
  END IF;
  
  -- Get current credits
  SELECT credits INTO current_credits FROM profiles WHERE id = user_id;
  
  -- Check if user has enough credits
  IF current_credits >= amount THEN
    -- Deduct credits
    UPDATE profiles SET credits = credits - amount WHERE id = user_id;
    
    -- Log the transaction
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES (user_id, 'credit_usage', amount, description);
    
    -- Log usage
    INSERT INTO usage_logs (user_id, feature, credits_used)
    VALUES (user_id, feature, amount);
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely promote users to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = TRUE 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke admin access
CREATE OR REPLACE FUNCTION revoke_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = FALSE 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure RLS policies allow admin access
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Test the deduct_credits function (optional - you can remove this)
-- SELECT public.deduct_credits('00000000-0000-0000-0000-000000000000'::UUID, 1.0, 'test', 'Test deduction');

-- Now make yourself an admin (replace with your actual email)
-- SELECT promote_to_admin('your-email@example.com');