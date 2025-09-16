import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  credits: number
  premium_until: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'credit_purchase' | 'premium_purchase' | 'credit_usage'
  amount: number
  description: string
  yoco_payment_id: string | null
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  feature: 'love_note' | 'love_doctor' | 'quiz'
  credits_used: number
  created_at: string
}

