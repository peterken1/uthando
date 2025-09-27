import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { userId, loveLanguage, responses, language } = await req.json();

        if (!userId || !loveLanguage) {
            return NextResponse.json({ error: 'User ID and love language are required.' }, { status: 400 });
        }

        // Save quiz results to database
        const { data, error } = await supabase
            .from('quiz_results')
            .insert({
                user_id: userId,
                love_language: loveLanguage,
                responses: responses,
                language: language,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to save quiz results.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error saving quiz results:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}