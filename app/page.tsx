"use client";
import React from "react";
import LoveNoteGenerator from "@/components/LoveNoteGenerator";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { refreshProfile, profile } = useAuth();

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="max-w-md mx-auto">
        {/* Temporary refresh button */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="space-x-2 mb-2">
            <button
              onClick={refreshProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Refresh Profile Data
            </button>
            <button
              onClick={async () => {
                const { supabase } = await import('@/lib/supabase');

                // Test 1: Check if profile exists
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', 'aecd5e10-7287-4d7a-a48a-a07e73a7f152')
                  .single();

                console.log('Profile query:', { profile, profileError });

                // Test 2: Check table structure
                const { data: allProfiles, error: allError } = await supabase
                  .from('profiles')
                  .select('*')
                  .limit(1);

                console.log('Table structure:', { allProfiles, allError });

                if (profileError) {
                  alert(`Error: ${profileError.message}`);
                } else {
                  alert(`Credits: ${profile?.credits}, Admin: ${profile?.is_admin}, Email: ${profile?.email}`);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🔍 Test DB Direct
            </button>
            <button
              onClick={async () => {
                try {
                  console.log('Manual sign out clicked');
                  const { supabase } = await import('@/lib/supabase');
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    console.error('Supabase sign out error:', error);
                  }
                  // Clear localStorage
                  localStorage.clear();
                  // Force reload
                  window.location.href = '/';
                } catch (error) {
                  console.error('Manual sign out error:', error);
                  // Force reload anyway
                  window.location.href = '/';
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              🚪 Force Sign Out
            </button>
          </div>
          <p className="text-xs text-blue-700">
            Credits: R{profile?.credits?.toFixed(2) || '0.00'} | Admin: {profile?.is_admin ? 'Yes' : 'No'}
          </p>
        </div>

        <LoveNoteGenerator />
      </div>
    </main>
  );
}
