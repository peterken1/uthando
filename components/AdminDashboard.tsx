"use client";
import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Activity, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
    id: string;
    email: string;
    full_name: string | null;
    credits: number;
    premium_until: string | null;
    is_admin: boolean;
    created_at: string;
    transactions: { count: number }[];
    usage_logs: { count: number }[];
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user, profile } = useAuth();

    useEffect(() => {
        if (user && profile?.is_admin) {
            fetchUsers();
        }
    }, [user, profile]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/admin/users?userId=${user?.id}`);
            const data = await response.json();

            if (response.ok) {
                setUsers(data.users);
            } else {
                console.error('Failed to fetch users:', data.error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (targetUserId: string, updates: Partial<User>) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    targetUserId,
                    updates
                })
            });

            if (response.ok) {
                await fetchUsers();
                setShowEditModal(false);
                setSelectedUser(null);
            } else {
                const data = await response.json();
                console.error('Failed to update user:', data.error);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const giveCredits = (targetUser: User, amount: number) => {
        const newCredits = targetUser.credits + amount;
        updateUser(targetUser.id, { credits: newCredits });
    };

    const toggleAdmin = (targetUser: User) => {
        updateUser(targetUser.id, { is_admin: !targetUser.is_admin });
    };

    if (!profile?.is_admin) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="text-gray-600 mt-2">You don't have admin privileges.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
            </div>
        );
    }

    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.premium_until && new Date(u.premium_until) > new Date()).length;
    const totalCreditsDistributed = users.reduce((sum, u) => sum + u.credits, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users and monitor app usage</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Premium Users</p>
                            <p className="text-2xl font-bold text-gray-900">{premiumUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Credits</p>
                            <p className="text-2xl font-bold text-gray-900">{totalCreditsDistributed}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <Settings className="h-8 w-8 text-pink-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.is_admin).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Credits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Premium
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.full_name || 'No name'}
                                            </div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">R{user.credits.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.premium_until && new Date(user.premium_until) > new Date() ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                None
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.is_admin ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => giveCredits(user, 5)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            +R5
                                        </button>
                                        <button
                                            onClick={() => giveCredits(user, 20)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            +R20
                                        </button>
                                        <button
                                            onClick={() => toggleAdmin(user)}
                                            className="text-purple-600 hover:text-purple-900"
                                        >
                                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}