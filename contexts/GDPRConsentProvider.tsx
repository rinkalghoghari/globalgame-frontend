"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GDPRConsentContext } from '@/components/GoogleAd';

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

export function GDPRConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentStatus | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedConsent = localStorage.getItem(CONSENT_KEY);
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent) as ConsentStatus;
        setConsentState(parsed);
      } else {
        setConsentState(DEFAULT_CONSENT);
      }
    } catch (e) {
      console.error('Error loading consent preferences:', e);
      setConsentState(DEFAULT_CONSENT);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setConsent = useCallback((value: boolean) => {
    setConsentState(prev => {
      const newState = {
        consentGiven: true,
        preferences: {
          ...(prev?.preferences || DEFAULT_CONSENT.preferences),
          advertising: value,
        },
        lastUpdated: new Date().toISOString(),
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(newState));
        
        // If user accepts advertising, we'll let the GoogleAd component handle the initialization
        if (!value) {
          // If user rejects, remove ad-related cookies
          document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (name.includes('_ga') || name.includes('_gid') || name.includes('_gat') || 
                name.includes('_gcl_au') || name.includes('IDE') || name.includes('test_cookie')) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')};`;
            }
          });
        }
      }
      
      return newState;
    });
  }, []);

  // Don't render children until we've loaded the consent state
  if (!isInitialized || !consentState) {
    return null;
  }

  return (
    <GDPRConsentContext.Provider 
      value={{ 
        hasConsent: consentState.preferences.advertising, 
        setConsent,
        consentState
      }}
    >
      {children}
    </GDPRConsentContext.Provider>
  );
}
