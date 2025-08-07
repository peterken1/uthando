"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';
import SignUp from './SignUp';
import SignIn from './SignIn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {mode === 'signup' ? (
          <SignUp
            onSwitchToSignIn={() => setMode('signin')}
            onClose={onClose}
          />
        ) : (
          <SignIn
            onSwitchToSignUp={() => setMode('signup')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

