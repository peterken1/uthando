"use client";
import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
                    <p className="text-gray-600">You need to be signed in to access the admin panel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminDashboard />
        </div>
    );
}