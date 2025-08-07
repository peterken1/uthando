# Uthando Payment Integration & User System Plan

## Overview
Transform Uthando into a subscription-based app with user accounts, free credits, and premium access.

## Payment & Credit System

### Free Tier
- R5 credits on signup
- Credits consumed per AI interaction:
  - Love Note Generation: R1 per note
  - Love Doctor Chat: R0.50 per message
  - Quiz: Free (no credit cost)

### Premium Tier (R30 for 30 days)
- Unlimited access to all features
- No credit deduction
- Priority support
- Advanced coaching features

## Technical Implementation

### Database Schema (Supabase)
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  credits DECIMAL DEFAULT 5.00,
  premium_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT, -- 'credit_purchase', 'premium_purchase', 'credit_usage'
  amount DECIMAL,
  description TEXT,
  yoco_payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  feature TEXT, -- 'love_note', 'love_doctor', 'quiz'
  credits_used DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Authentication Flow
1. Sign up with email/password
2. Create profile with R5 credits
3. Email verification (optional)
4. Onboarding tour

### Payment Flow
1. User clicks "Upgrade to Premium"
2. Redirect to Yoco payment link
3. Payment success → webhook/callback
4. Update user premium status
5. Redirect back to app with success message

### Credit System
- Check credits before AI operations
- Deduct credits after successful operations
- Show credit balance in UI
- Prompt for upgrade when credits low

## Components to Create

### Authentication
- `SignUp.tsx` - Registration form
- `SignIn.tsx` - Login form
- `AuthProvider.tsx` - Context for auth state
- `ProtectedRoute.tsx` - Route protection

### Payment
- `PremiumUpgrade.tsx` - Upgrade button/modal
- `CreditBalance.tsx` - Display current credits
- `PaymentSuccess.tsx` - Success page after payment

### User Management
- `UserProfile.tsx` - Account settings
- `UsageHistory.tsx` - Transaction history
- `SubscriptionStatus.tsx` - Premium status display

## API Routes to Add
- `/api/auth/callback` - Handle auth callbacks
- `/api/payment/webhook` - Yoco webhook handler
- `/api/user/credits` - Get/update user credits
- `/api/user/premium` - Check premium status

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
YOCO_WEBHOOK_SECRET=
```

## Feature Access Control

### Free Users (with credits)
- Love Note Generator (R1 per note)
- Love Doctor Chat (R0.50 per message)
- Love Language Quiz (free)
- Limited to credit balance

### Premium Users
- All features unlimited
- No credit deduction
- Advanced Love Doctor prompts
- Priority features

## Implementation Steps
1. Set up Supabase client and auth
2. Create database schema
3. Implement authentication components
4. Add credit system to existing features
5. Integrate Yoco payment flow
6. Add user dashboard and settings
7. Test complete flow
8. Deploy with environment variables

