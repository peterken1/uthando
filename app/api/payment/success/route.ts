import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  const paymentId = searchParams.get('payment_id');

  if (!userId) {
    return NextResponse.redirect(new URL('/?error=missing_user_id', req.url));
  }

  try {
    // Check if user's premium status was updated (webhook should have handled this)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('premium_until')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return NextResponse.redirect(new URL('/?error=user_not_found', req.url));
    }

    const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();

    if (isPremium) {
      // Success - redirect to app with success message
      return NextResponse.redirect(new URL('/?payment=success', req.url));
    } else {
      // Payment might still be processing
      return NextResponse.redirect(new URL('/?payment=processing', req.url));
    }

  } catch (error) {
    console.error('Payment success callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback_failed', req.url));
  }
}

