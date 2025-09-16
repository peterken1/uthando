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
                const { data, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', 'aecd5e10-7287-4d7a-a48a-a07e73a7f152')
                  .single();
                console.log('Direct DB query result:', { data, error });
                alert(`Credits: ${data?.credits}, Admin: ${data?.is_admin}`);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🔍 Test DB Direct
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
