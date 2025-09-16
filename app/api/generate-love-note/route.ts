import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { recipient, sender, language, userId } = await req.json();

    if (!recipient || !sender) {
      return NextResponse.json({ error: 'Recipient and sender names are required.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User authentication required.' }, { status: 401 });
    }

    // Check if user has premium access or enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, premium_until, is_admin')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({ error: 'Database error: ' + profileError.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
    const hasCredits = profile.credits >= 1;

    if (!isPremium && !hasCredits) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade to premium or purchase more credits.' }, { status: 402 });
    }

    // Generate the love note
    const prompt = `Write a heartfelt love note in ${language} from ${sender} to ${recipient}. Make it romantic, poetic, and emotionally moving. The note should be personal and express deep affection.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
    });

    const note = response.choices[0]?.message?.content;

    if (!note) {
      throw new Error('No response from OpenAI');
    }

    // Deduct credits if not premium
    if (!isPremium) {
      const { error: deductError } = await supabase.rpc('deduct_credits', {
        user_id: userId,
        amount: 1.0,
        feature: 'love_note',
        description: `Love note generation in ${language}`
      });

      if (deductError) {
        console.error('Error deducting credits:', deductError);
        return NextResponse.json({ error: 'Failed to process payment.' }, { status: 500 });
      }
    } else {
      // Log usage for premium users (no credit deduction)
      await supabase
        .from('usage_logs')
        .insert({
          user_id: userId,
          feature: 'love_note',
          credits_used: 0
        });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error generating love note:', error);
    return NextResponse.json({ error: 'Failed to generate note.' }, { status: 500 });
  }
}
