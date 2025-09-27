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
    const hasCredits = profile.credits >= 0.5;

    if (!isPremium && !hasCredits) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade to premium or purchase more credits.' }, { status: 402 });
    }

    // Get user's quiz results for personalized coaching
    const { data: quizData } = await supabase
      .from('quiz_results')
      .select('love_language, responses, language')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Build context for the AI coach
    let systemPrompt = `You are a world-class Love Doctor - an AI relationship coach with deep expertise in emotional intelligence, attachment theory, and the 5 Love Languages. Your role is to:

1. Provide warm, empathetic, and personalized relationship guidance
2. Ask insightful questions that promote deep self-reflection
3. Offer evidence-based advice rooted in relationship psychology
4. Help users understand their emotional patterns and communication styles
5. Maintain professional boundaries while being genuinely caring
6. Keep responses conversational, insightful, and under 200 words

Your coaching style:
- Use "I" statements and speak as a caring expert friend
- Reference specific love language insights when relevant
- Ask powerful questions that unlock new perspectives
- Validate emotions while gently challenging limiting beliefs
- Focus on actionable steps for relationship growth
- Be culturally sensitive and inclusive
- Draw from attachment theory, emotional intelligence, and communication research`;

    if (quizData?.love_language) {
      systemPrompt += `\n\nIMPORTANT PERSONALIZATION:
The user's primary love language is ${quizData.love_language}. This means they feel most loved through:
- Words of Affirmation: Verbal expressions of love and appreciation
- Acts of Service: Helpful actions and thoughtful gestures  
- Quality Time: Focused, uninterrupted time together
- Receiving Gifts: Thoughtful gifts and meaningful surprises
- Physical Touch: Physical affection and closeness

Tailor your coaching to help them:
1. Better communicate their ${quizData.love_language} needs to their partner
2. Recognize when their partner shows love in other love languages
3. Learn to express love in their partner's preferred love language
4. Address relationship challenges through their love language lens`;
    }

    if (quizResults) {
      systemPrompt += `\n\nAdditional context from conversation: ${quizResults}`;
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
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

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

