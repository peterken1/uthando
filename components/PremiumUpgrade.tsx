"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Check, X, ExternalLink } from 'lucide-react';

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumUpgrade({ isOpen, onClose }: PremiumUpgradeProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Create callback URL for after payment
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/api/payment/success?user_id=${user.id}`;
      
      // Create a payment session with user ID for tracking
      const paymentUrl = `https://pay.yoco.com/r/2bjoBv?user_id=${user.id}&email=${user.email}&success_url=${encodeURIComponent(successUrl)}`;
      
      // Open payment in new window
      window.open(paymentUrl, '_blank');
      
      // Close modal after opening payment
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Unlimited love note generation',
    'Unlimited Love Doctor conversations',
    'Advanced AI coaching prompts',
    'Priority customer support',
    'No credit deductions',
    'Access to premium features',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
            <p className="text-gray-600">Unlock unlimited access to all Uthando features</p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">R30</div>
              <div className="text-sm text-gray-600">for 30 days</div>
              <div className="text-xs text-green-600 font-medium mt-1">Save R20+ vs credits</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">What you get:</h3>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm font-medium">💡 Current Usage</p>
            <p className="text-blue-700 text-xs mt-1">
              Credits remaining: R{profile?.credits?.toFixed(2) || '0.00'}
            </p>
            <p className="text-blue-700 text-xs">
              With premium, you'll never run out of credits again!
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? (
              'Opening Payment...'
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Upgrade Now - R30
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Secure payment powered by Yoco. You'll be redirected to complete your payment.
          </p>
        </div>
      </div>
    </div>
  );
}

