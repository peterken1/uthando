"use client";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDebugInfo() {
    const { user, profile } = useAuth();

    if (!user) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Please sign in to see your user info</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your User Info:</h3>
            <div className="space-y-1 text-sm">
                <p><strong>User ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{user.id}</code></p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Credits:</strong> R{profile?.credits?.toFixed(2) || '0.00'}</p>
                <p><strong>Admin:</strong> {profile?.is_admin ? 'Yes' : 'No'}</p>
            </div>
            <button
                onClick={() => navigator.clipboard.writeText(user.id)}
                className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
                Copy User ID
            </button>
        </div>
    );
}