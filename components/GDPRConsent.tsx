"use client";

import { useState, useEffect, useContext } from "react";
import { GDPRConsentContext } from "./GoogleAd";

type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  preferences: boolean;
};

type ConsentStatus = {
  consentGiven: boolean;
  preferences: ConsentPreferences;
  lastUpdated: string;
};

const CONSENT_KEY = "gdpr_consent_status";
const DEFAULT_CONSENT: ConsentStatus = {
  consentGiven: false,
  preferences: {
    necessary: true, // Always true as these are required for basic functionality
    analytics: false,
    advertising: false,
    preferences: false,
  },
  lastUpdated: new Date().toISOString(),
};

export default function GDPRConsent() {
  const [showDialog, setShowDialog] = useState(false);
  const [, setConsentState] = useState<ConsentStatus>(DEFAULT_CONSENT);
  const { setConsent } = useContext(GDPRConsentContext);

  // Load saved consent preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedConsent = localStorage.getItem(CONSENT_KEY);
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent) as ConsentStatus;
        setConsentState(parsed);
        setConsent(parsed.preferences.advertising);
        
        // Only show dialog if no consent was given yet
        if (!parsed.consentGiven) {
          setShowDialog(true);
        }
      } else {
        // First time visitor
        setShowDialog(true);
      }
    } catch (e) {
      console.error('Error loading consent preferences:', e);
      setShowDialog(true);
    }
  }, [setConsent]);

  const saveConsent = (prefs: ConsentPreferences) => {
    const newConsentState: ConsentStatus = {
      consentGiven: true,
      preferences: prefs,
      lastUpdated: new Date().toISOString(),
    };
    
    setConsentState(newConsentState);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsentState));
    
    // Update global consent state
    setConsent(prefs.advertising);
    
    // Initialize or remove tracking based on preferences
    if (prefs.advertising) {
      initializeTracking();
    } else {
      removeTrackingCookies();
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      advertising: true,
      preferences: true,
    });
    setShowDialog(false);
  };

  // const handleSavePreferences = (prefs: ConsentPreferences) => {
  //   saveConsent({
  //     ...prefs,
  //     necessary: true // Ensure necessary is always true
  //   });
  //   setShowSettings(false);
  //   setShowDialog(false);
  // };

  const handleDecline = () => {
    // Only keep necessary cookies
    saveConsent({
      necessary: true,
      analytics: false,
      advertising: false,
      preferences: false,
    });
    setShowDialog(false);
  };

    const initializeTracking = () => {
    // Initialize Google AdSense
    if (typeof window !== 'undefined') {
      // Check if script is already added
      if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        // Add Google AdSense script
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // Initialize ads
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
      
      console.log('Ads initialized with user consent');
    }
  };

  const removeTrackingCookies = () => {
    // Remove ad-related cookies
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // Remove Google AdSense and other ad-related cookies
        if (name.includes('_ga') || name.includes('_gid') || name.includes('_gat') || 
            name.includes('_gcl_au') || name.includes('IDE') || name.includes('test_cookie')) {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname.split('.').slice(-2).join('.');
        }
      }
      console.log('Removed ad tracking cookies');
    }
  };

  if (!showDialog) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
            {' '}
            <a 
              href="/privacy-policy" 
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
