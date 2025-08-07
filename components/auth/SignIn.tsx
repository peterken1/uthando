"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react';

interface SignInProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export default function SignIn({ onSwitchToSignUp, onClose }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-pink-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your Uthando account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Sign Up for Free
          </button>
        </p>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm font-medium">💡 New to Uthando?</p>
        <p className="text-blue-700 text-xs mt-1">
          Sign up now and get R5 free credits to start generating love notes and chatting with our AI Love Doctor!
        </p>
      </div>
    </div>
  );
}

