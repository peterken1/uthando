import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all users (admin only)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single();

        if (profileError || !profile?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get all users with their stats
        const { data: users, error } = await supabase
            .from('profiles')
            .select(`
        *,
        transactions:transactions(count),
        usage_logs:usage_logs(count)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// Update user (admin only)
export async function PATCH(req: NextRequest) {
    try {
        const { userId, targetUserId, updates } = await req.json();

        if (!userId || !targetUserId) {
            return NextResponse.json({ error: 'User IDs required' }, { status: 400 });
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single();

        if (profileError || !profile?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Update target user
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', targetUserId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ user: data });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}