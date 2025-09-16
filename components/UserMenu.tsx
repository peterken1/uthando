"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Crown, Settings, CreditCard } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import PremiumUpgrade from './PremiumUpgrade';

export default function UserMenu() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isPremium = profile?.premium_until && new Date(profile.premium_until) > new Date();

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <User className="w-4 h-4 mr-2" />
          Sign In
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signin"
        />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-medium">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="text-gray-700 max-w-24 truncate">
            {profile?.full_name || user.email}
          </span>
          {isPremium && <Crown className="w-4 h-4 text-yellow-500 ml-1" />}
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-gray-100">
              <p className="font-medium text-gray-900 truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              {isPremium ? (
                <div className="flex items-center mt-1">
                  <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600 font-medium">Premium Active</span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Credits: R{profile?.credits?.toFixed(2) || '0.00'}
                </p>
              )}
            </div>

            <div className="p-2">
              {!isPremium && (
                <button
                  onClick={() => {
                    setShowUpgradeModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Crown className="w-4 h-4 mr-3" />
                  Upgrade to Premium
                </button>
              )}

              {profile?.is_admin && (
                <button
                  onClick={() => {
                    window.location.href = '/admin';
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={async () => {
                  await refreshProfile();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Refresh Profile
              </button>

              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </button>

              <button
                onClick={async () => {
                  try {
                    setShowUserMenu(false);
                    console.log('Attempting to sign out...');
                    await signOut();
                  } catch (error) {
                    console.error('Sign out error:', error);
                    // Force reload even if sign out fails
                    window.location.href = '/';
                  }
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <PremiumUpgrade
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}

