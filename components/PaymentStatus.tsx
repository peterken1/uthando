"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, XCircle, X } from 'lucide-react';

export default function PaymentStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Check URL parameters for payment status
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const error = urlParams.get('error');

    if (paymentStatus || error) {
      setStatus(paymentStatus || error || 'unknown');
      setShow(true);

      // Refresh profile to get updated premium status
      if (paymentStatus === 'success') {
        setTimeout(() => {
          refreshProfile();
        }, 1000);
      }

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [refreshProfile]);

  const handleClose = () => {
    setShow(false);
    setStatus(null);
  };

  if (!show || !status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          title: 'Payment Successful! 🎉',
          message: 'Welcome to Uthando Premium! You now have unlimited access to all features.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'processing':
        return {
          icon: <Clock className="w-6 h-6 text-blue-500" />,
          title: 'Payment Processing ⏳',
          message: 'Your payment is being processed. You\'ll receive confirmation shortly.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      default:
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          title: 'Payment Issue ❌',
          message: 'There was an issue with your payment. Please try again or contact support.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {config.title}
            </h3>
            <p className={`text-sm mt-1 ${config.textColor} opacity-90`}>
              {config.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`ml-4 ${config.textColor} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

