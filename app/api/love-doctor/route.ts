import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, quizResults, conversationHistory, userId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User authentication required.' }, { status: 401 });
    }

    // Check if user has premium access or enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, premium_until')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
    const hasCredits = profile.credits >= 0.5;

    if (!isPremium && !hasCredits) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade to premium or purchase more credits.' }, { status: 402 });
    }

    // Build context for the AI coach
    let systemPrompt = `You are a warm, empathetic Love Doctor - an AI relationship coach trained in emotional intelligence. Your role is to:

1. Provide supportive, non-judgmental guidance on relationships and love
2. Ask thoughtful questions that encourage self-reflection
3. Offer practical, actionable advice based on emotional intelligence principles
4. Be encouraging and help users see their own strengths
5. Maintain appropriate boundaries - you're a coach, not a therapist
6. Keep responses conversational, warm, and under 150 words

Guidelines:
- Use "I" statements and personal language to feel more human
- Ask follow-up questions to deepen reflection
- Acknowledge emotions and validate feelings
- Offer gentle challenges when appropriate
- Focus on growth and positive communication patterns
- Be culturally sensitive and inclusive`;

    if (quizResults) {
      systemPrompt += `\n\nThe user has taken a love language quiz. Their responses suggest they value: ${quizResults}. Use this insight to personalize your coaching.`;
    }

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add recent conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;

    // Deduct credits if not premium
    if (!isPremium) {
      const { error: deductError } = await supabase.rpc('deduct_credits', {
        user_id: userId,
        amount: 0.5,
        feature: 'love_doctor',
        description: 'Love Doctor conversation message'
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
          feature: 'love_doctor',
          credits_used: 0
        });
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in Love Doctor API:', error);
    return NextResponse.json({ error: 'Failed to get response from Love Doctor.' }, { status: 500 });
  }
}

