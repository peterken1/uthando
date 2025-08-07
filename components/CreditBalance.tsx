"use client";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Crown } from 'lucide-react';

interface CreditBalanceProps {
  onUpgradeClick?: () => void;
}

export default function CreditBalance({ onUpgradeClick }: CreditBalanceProps) {
  const { profile, user } = useAuth();

  if (!user || !profile) return null;

  const isPremium = profile.premium_until && new Date(profile.premium_until) > new Date();
  const credits = profile.credits || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isPremium ? (
            <>
              <Crown className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Premium Active</p>
                <p className="text-xs text-gray-600">
                  Until {new Date(profile.premium_until!).toLocaleDateString()}
                </p>
              </div>
            </>
          ) : (
            <>
              <Coins className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  R{credits.toFixed(2)} Credits
                </p>
                <p className="text-xs text-gray-600">
                  {credits < 1 ? 'Low balance' : `${Math.floor(credits)} love notes available`}
                </p>
              </div>
            </>
          )}
        </div>

        {!isPremium && onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Upgrade
          </button>
        )}
      </div>

      {!isPremium && credits < 1 && (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
          💡 You're running low on credits. Upgrade to premium for unlimited access!
        </div>
      )}
    </div>
  );
}

