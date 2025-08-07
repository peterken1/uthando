"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Heart, MessageCircle, ArrowLeft, Loader, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import CreditBalance from './CreditBalance';
import PremiumUpgrade from './PremiumUpgrade';
import UserMenu from './UserMenu';
import PaymentStatus from './PaymentStatus';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function LoveDoctor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    // Load quiz results from localStorage if available
    const savedQuizResults = localStorage.getItem('quizResults');
    if (savedQuizResults) {
      setQuizResults(savedQuizResults);
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hello! I'm your Love Doctor, here to provide warm, supportive relationship coaching. ${savedQuizResults ? 'I see you\'ve taken our love language quiz - that\'s wonderful! ' : ''}I'm here to help you reflect on your relationships and offer personalized guidance. What's on your heart today?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check if user has premium or enough credits
    const isPremium = profile?.premium_until && new Date(profile.premium_until) > new Date();
    const hasCredits = profile?.credits && profile.credits >= 0.5;

    if (!isPremium && !hasCredits) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    setError('');

    try {
      const response = await fetch("/api/love-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: inputText.trim(),
          quizResults: quizResults,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Refresh profile to update credits
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <PaymentStatus />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBackToHome}
              className="mr-3 p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-pink-600" />
            </button>
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-pink-500 mr-2" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Love Doctor</h1>
                <p className="text-xs text-gray-600">Your AI Relationship Coach</p>
              </div>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Credit Balance */}
      {user && (
        <div className="bg-white border-b border-pink-100 px-4 py-3">
          <div className="max-w-md mx-auto">
            <CreditBalance onUpgradeClick={() => setShowUpgradeModal(true)} />
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-2">
          <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      {!user && (
        <div className="px-4 py-2">
          <div className="max-w-md mx-auto p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">🎁 Sign up and get R5 free credits!</p>
            <p className="text-blue-700 text-xs mt-1">
              Create an account to start chatting with the Love Doctor (R0.50 per message).
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-800 shadow-sm border border-pink-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? "text-pink-100" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-pink-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-pink-500" />
                  <p className="text-sm text-gray-600">Love Doctor is typing...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-pink-100 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={user ? "Share what's on your heart..." : "Sign in to chat with Love Doctor"}
                className="w-full px-4 py-3 pr-12 border border-pink-200 rounded-2xl focus:border-pink-500 focus:outline-none resize-none max-h-32"
                rows={1}
                disabled={loading || !user}
              />
            </div>
            <button
              onClick={user ? handleSendMessage : () => setShowAuthModal(true)}
              disabled={loading || (!user && false)}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white p-3 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {user && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {profile?.premium_until && new Date(profile.premium_until) > new Date()
                ? '💎 Premium: Unlimited messages'
                : `💰 R0.50 per message • ${Math.floor((profile?.credits || 0) / 0.5)} messages remaining`
              }
            </p>
          )}
          
          {!quizResults && user && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700 mb-2">
                💡 For more personalized coaching, consider taking our love language quiz first!
              </p>
              <button
                onClick={() => window.location.href = "/quiz"}
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />

      <PremiumUpgrade
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}

