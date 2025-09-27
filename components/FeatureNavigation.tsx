"use client";

import React from 'react';
import { Heart, MessageCircle, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureNavigationProps {
    currentFeature?: 'home' | 'quiz' | 'doctor' | 'notes';
    onAuthRequired?: () => void;
}

export default function FeatureNavigation({ currentFeature = 'home', onAuthRequired }: FeatureNavigationProps) {
    const { user } = useAuth();

    const handleNavigation = (path: string, requiresAuth: boolean = false) => {
        if (requiresAuth && !user && onAuthRequired) {
            onAuthRequired();
            return;
        }
        window.location.href = path;
    };

    const features = [
        {
            id: 'notes',
            path: '/',
            icon: Heart,
            title: 'Love Notes',
            description: 'Generate heartfelt messages',
            color: 'pink',
            requiresAuth: false
        },
        {
            id: 'quiz',
            path: '/quiz',
            icon: Brain,
            title: 'Love Language Quiz',
            description: 'Discover how you love',
            color: 'purple',
            requiresAuth: false
        },
        {
            id: 'doctor',
            path: '/love-doctor',
            icon: MessageCircle,
            title: 'Love Doctor',
            description: 'Get relationship coaching',
            color: 'pink',
            requiresAuth: true
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700">Explore Uthando Features</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    const isActive = currentFeature === feature.id;
                    const colorClasses = feature.color === 'pink'
                        ? 'bg-pink-50 border-pink-200 text-pink-700'
                        : 'bg-purple-50 border-purple-200 text-purple-700';

                    return (
                        <button
                            key={feature.id}
                            onClick={() => handleNavigation(feature.path, feature.requiresAuth)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${isActive
                                    ? colorClasses
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Icon className={`w-6 h-6 mx-auto mb-1 ${isActive
                                    ? (feature.color === 'pink' ? 'text-pink-500' : 'text-purple-500')
                                    : 'text-gray-500'
                                }`} />
                            <div className="text-xs font-medium">{feature.title}</div>
                            <div className="text-xs opacity-75 mt-1">{feature.description}</div>
                            {feature.requiresAuth && !user && (
                                <div className="text-xs text-blue-600 mt-1">Sign up required</div>
                            )}
                        </button>
                    );
                })}
            </div>

            {!user && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-blue-800 text-xs font-medium">🎁 Sign up for R5 free credits!</p>
                </div>
            )}
        </div>
    );
}