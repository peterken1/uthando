"use client";
import React, { useState } from "react";
import { Copy, Loader, Send, Heart, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./auth/AuthModal";
import CreditBalance from "./CreditBalance";
import PremiumUpgrade from "./PremiumUpgrade";
import UserMenu from "./UserMenu";
import PaymentStatus from "./PaymentStatus";

export default function LoveNoteGenerator() {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [language, setLanguage] = useState("English");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { user, profile, refreshProfile } = useAuth();

  const handleGenerate = async () => {
    if (!recipient.trim() || !sender.trim()) {
      setError("Please enter both your name and recipient's name");
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check if user has premium or enough credits
    const isPremium = profile?.premium_until && new Date(profile.premium_until) > new Date();
    const hasCredits = profile?.credits && profile.credits >= 1;

    if (!isPremium && !hasCredits) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setNote("");
    setError("");
    
    try {
      const res = await fetch("/api/generate-love-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipient: recipient.trim(), 
          sender: sender.trim(), 
          language,
          userId: user.id 
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNote(data.note);
      
      // Refresh profile to update credits
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate love note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleShare = () => {
    const shareText = `${note}\n\n❤️ Yours in Love, ${sender || "Your Love"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleFeedback = (emoji: string) => {
    setFeedback(emoji);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-start px-4 pt-6 pb-32 text-center max-w-md mx-auto min-h-screen">
      <PaymentStatus />
      
      {/* Header with User Menu */}
      <div className="w-full flex justify-between items-center mb-6">
        <div></div> {/* Spacer */}
        <div className="flex flex-col items-center">
          <Heart className="w-12 h-12 text-pink-500 mb-2" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Uthando
          </h1>
          <p className="text-gray-600 text-sm">Generate heartfelt love notes with AI</p>
        </div>
        <UserMenu />
      </div>

      {/* Credit Balance */}
      {user && (
        <CreditBalance onUpgradeClick={() => setShowUpgradeModal(true)} />
      )}

      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="w-full space-y-3 mb-4">
        <input
          type="text"
          placeholder="Recipient's name (e.g., Sarah)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Your name (e.g., John)"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors"
          disabled={loading}
        />

        <label htmlFor="language-select" className="sr-only">
          Select language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors"
          aria-label="Select language"
          disabled={loading}
        >
          <option value="English">English</option>
          <option value="Swahili">Swahili</option>
          <option value="Shona">Shona</option>
          <option value="Dholuo">Dholuo</option>
          <option value="Kalenjin">Kalenjin</option>
          <option value="Kikuyu">Kikuyu</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex justify-center items-center mb-4 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <Loader className="animate-spin" size={18} />
        ) : (
          <>
            <Send className="mr-2" size={18} />
            {user ? 'Generate Love Note' : 'Sign In to Generate'}
          </>
        )}
      </button>

      {!user && (
        <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">🎁 Sign up and get R5 free credits!</p>
          <p className="text-blue-700 text-xs mt-1">
            Create an account to start generating love notes and chatting with our AI Love Doctor.
          </p>
        </div>
      )}

      {note && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 w-full mb-4 text-left whitespace-pre-wrap shadow-sm">
            {note}
            <p className="mt-4 font-semibold italic text-right text-gray-700">
              ❤️ Yours in Love, <strong>{sender || "Your Love"}</strong>
            </p>
          </div>

          <div className="flex justify-between gap-3 w-full mb-4">
            <button
              onClick={handleCopy}
              className="bg-gray-100 hover:bg-gray-200 border px-4 py-2 rounded-lg flex-1 flex items-center justify-center transition-colors"
            >
              <Copy className="mr-1" size={16} />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleShare}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097z"/>
              </svg>
              WhatsApp
            </button>
          </div>

          <p className="text-sm mb-2 text-gray-600">How did this love note feel?</p>
          <div className="text-2xl mb-2">
            <button 
              onClick={() => handleFeedback("😍")} 
              className="mx-1 hover:scale-110 transition-transform"
              title="Love it!"
            >
              😍
            </button>
            <button 
              onClick={() => handleFeedback("😊")} 
              className="mx-1 hover:scale-110 transition-transform"
              title="Good"
            >
              😊
            </button>
            <button 
              onClick={() => handleFeedback("😢")} 
              className="mx-1 hover:scale-110 transition-transform"
              title="Could be better"
            >
              😢
            </button>
          </div>
          {feedback && (
            <p className="text-sm italic mb-6 text-gray-600 animate-fade-in">
              Thank you for your feedback! {feedback}
            </p>
          )}
        </>
      )}

      <div className="sticky bottom-4 mt-6 w-full text-center space-y-3">
        <button
          onClick={() => (window.location.href = "/love-doctor")}
          className="bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-pink-700 transition-all duration-200 w-full"
        >
          💬 Chat with Love Doctor
        </button>
        <button
          onClick={() => (window.location.href = "/quiz")}
          className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-purple-700 transition-all duration-200 w-full"
        >
          💞 Take the Love Language Quiz
        </button>
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


