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

    // Get user's quiz results for personalization
    const quizResults = await supabase
      .from('quiz_results')
      .select('love_language, responses')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Build sophisticated prompt based on love language and cultural context
    let personalizedPrompt = `You are a world-class romantic writer creating a deeply personal love note. Write a heartfelt love note in ${language} from ${sender} to ${recipient}.

REQUIREMENTS:
- Make it emotionally resonant and authentic
- Use poetic but accessible language
- Include specific, vivid imagery and metaphors
- Express genuine vulnerability and deep affection
- Make it feel personal and unique, not generic
- Length: 3-4 meaningful sentences that flow beautifully

CULTURAL CONTEXT for ${language}:
${language === 'English' ? 'Use elegant, contemporary romantic language with subtle literary touches.' :
        language === 'Swahili' ? 'Incorporate beautiful Swahili expressions of love like "mapenzi yangu" and cultural metaphors about unity and devotion.' :
          language === 'Shona' ? 'Use warm Shona expressions and cultural references to deep, lasting love and commitment.' :
            'Use culturally appropriate expressions of deep affection and commitment.'}`;

    if (quizResults.data?.love_language) {
      personalizedPrompt += `\n\nLOVE LANGUAGE PERSONALIZATION:
The recipient's primary love language is ${quizResults.data.love_language}. Tailor the note accordingly:
- Words of Affirmation: Use powerful, affirming language that celebrates their qualities
- Acts of Service: Reference your commitment to supporting and caring for them
- Quality Time: Emphasize the precious moments you share and create together  
- Physical Touch: Include tender references to closeness, warmth, and physical connection
- Receiving Gifts: Focus on how they are your greatest treasure and gift`;
    }

    personalizedPrompt += `\n\nCreate something that would make ${recipient} feel truly seen, valued, and deeply loved.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a master of romantic expression, capable of creating love notes that move people to tears of joy. Your writing is sophisticated yet heartfelt, poetic yet genuine.'
        },
        { role: 'user', content: personalizedPrompt }
      ],
      max_tokens: 300,
      temperature: 0.9,
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
