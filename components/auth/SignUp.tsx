"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, User, Lock, Heart } from 'lucide-react';

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

export default function SignUp({ onSwitchToSignIn, onClose }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password || !fullName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(email, password, fullName);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6">
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Uthando! 💕</h2>
        <p className="text-gray-600 mb-4">
          Your account has been created successfully!
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">🎉 You've received R5 free credits!</p>
          <p className="text-green-700 text-sm mt-1">
            Start generating love notes and chatting with the Love Doctor right away.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Please check your email to verify your account.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-pink-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Join Uthando</h2>
        <p className="text-gray-600">Create your account and get R5 free credits</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              placeholder="Create a password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Creating Account...' : 'Create Account & Get R5 Free'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>

      <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
        <p className="text-pink-800 text-sm font-medium">🎁 Welcome Bonus</p>
        <p className="text-pink-700 text-xs mt-1">
          Get R5 free credits instantly to try all features. Generate love notes (R1 each) and chat with Love Doctor (R0.50 per message).
        </p>
      </div>
    </div>
  );
}

