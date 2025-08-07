"use client";
import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Check if user has previously dismissed the install prompt
    const installDismissed = localStorage.getItem('installPromptDismissed');
    if (installDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install banner after a delay if conditions are met
    const timer = setTimeout(() => {
      if (!isInstalled && !installDismissed) {
        setShowInstallBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the install prompt
      alert('To install this app:\n\n1. Tap the share button in your browser\n2. Select "Add to Home Screen"\n3. Tap "Add" to install');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (isInstalled || !showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white border border-pink-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <div className="bg-pink-100 p-2 rounded-lg mr-3">
              <Download className="w-5 h-5 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">Install Uthando</h3>
              <p className="text-xs text-gray-600 mt-1">
                Add to your home screen for quick access to love notes and relationship coaching
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

