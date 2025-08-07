-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  credits DECIMAL DEFAULT 5.00,
  premium_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credit_purchase', 'premium_purchase', 'credit_usage')),
  amount DECIMAL,
  description TEXT,
  yoco_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature TEXT CHECK (feature IN ('love_note', 'love_doctor', 'quiz')),
  credits_used DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for usage_logs
CREATE POLICY "Users can view own usage logs" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 5.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND premium_until > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id UUID, amount DECIMAL, feature TEXT, description TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits DECIMAL;
  has_premium BOOLEAN;
BEGIN
  -- Check if user has premium access
  SELECT public.has_premium_access(user_id) INTO has_premium;
  
  -- If user has premium, don't deduct credits
  IF has_premium THEN
    -- Log usage without deducting credits
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

