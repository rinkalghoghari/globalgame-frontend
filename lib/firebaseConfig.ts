// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  Analytics,
  logEvent as firebaseLogEvent,
  setAnalyticsCollectionEnabled,
} from "firebase/analytics";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics instance (set later)
let analytics: Analytics | undefined;

// Initialize Analytics only in browser
if (typeof window !== "undefined") {

  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        
        // Enable debug mode in development
        if (process.env.NODE_ENV !== 'production') {
          // @ts-expect-error - Debug mode is not in the types
          self.FIREBASE_ANALYTICS_DEBUG_MODE = true;
        }
        
        // Enable analytics collection
        setAnalyticsCollectionEnabled(analytics, true);
        
      } else {
      }
    })
    .catch((error) => {
      console.error("[Firebase] Analytics init error ❌", error);
    });
}

// --- Helper: wait until analytics ready ---
export const onAnalyticsReady = (): Promise<void> =>
  new Promise((resolve) => {
    const checkReady = () => {
      if (analytics) {
        resolve();
      } else {
        setTimeout(checkReady, 300);
      }
    };
    checkReady();
  });

// --- Safe logEvent wrapper ---
export const logEvent = (
  eventName: string,
  eventParams?: { [key: string]: string | number | boolean | null | undefined }
) => {
  if (typeof window === "undefined") {
    console.warn("[Firebase] logEvent called on server, skipped ❌");
    return;
  }
  if (!analytics) {
    console.warn("[Firebase] logEvent called before analytics ready ❌");
    return;
  }

  try {
    // Add debug info
    const debugParams = {
      ...eventParams,
      debug_mode: process.env.NODE_ENV !== 'production',
      debug_timestamp: new Date().toISOString(),
    };
    
    firebaseLogEvent(analytics, eventName, debugParams);
    
    // For debugging in console
    if (process.env.NODE_ENV !== 'production') {
    }
  } catch (error) {
    console.error("[Firebase] Error logging event ❌:", error);
  }
};

// Initialize Remote Config
const remoteConfig = getRemoteConfig(app);
// In development, we can set this to 0 to always fetch the latest values
const isDevelopment = process.env.NODE_ENV !== 'production';
remoteConfig.settings = {
  minimumFetchIntervalMillis: isDevelopment ? 0 : 3600000, // 1 hour in production
  fetchTimeoutMillis: 10000 // 10 seconds
};

// Set default values for ad slots
remoteConfig.defaultConfig = {
  ad_slot_id: 'default_ad_slot_id',
  popup_ad_slot: 'DEFAULT_POPUP_AD_SLOT',
  top_banner_ad_slot: 'DEFAULT_TOP_BANNER_AD_SLOT',
  // Add more default slots as needed
};

if (isDevelopment) {
  console.log('Remote Config settings:', {
    settings: remoteConfig.settings,
    defaultConfig: remoteConfig.defaultConfig,
    isInitialized: remoteConfig !== undefined
  });
}

// Function to get ad configuration from Remote Config
export const getAdSlotId = async (slotName: string = ''): Promise<string> => {
  try {
    if (typeof window === 'undefined') {
      console.warn('Remote Config not available on server side');
      return '';
    }

    console.log('🔍 getAdSlotId called with slotName:', slotName);
    
    // Cache key for the entire config
    const cacheKey = 'ad_config_cache';
    let config: Record<string, string> = {};

    // Try to get cached config
    try {
      const cachedConfig = sessionStorage.getItem(cacheKey);
      if (cachedConfig) {
        console.log('📡 Found cached ad config in sessionStorage');
        config = JSON.parse(cachedConfig);
        console.log('📋 Cached config content:', config);
        if (isDevelopment) {
          console.log('📡 Using cached ad config');
        }
        
        // Return cached value if available
        if (slotName && config[slotName]) {
          return config[slotName];
        } else if (!slotName) {
          return JSON.stringify(config);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached ad config:', e);
    }

    // If we get here, we need to fetch the config
    if (isDevelopment) {
      console.log('🔄 Fetching ad config from Remote Config...');
    }

    const startTime = performance.now();
    
    try {
      // Fetch and activate the remote config
      await fetchAndActivate(remoteConfig);
      
      // Get the JSON config from remote config
      console.log('🔄 Fetching Remote Config...');
      const configValue = getValue(remoteConfig, 'ad_slots');
      
      console.log('📊 Raw Remote Config value:', {
        exists: !!configValue,
        source: configValue?.getSource(),
        stringValue: configValue?.asString()
      });
      
      if (!configValue || !configValue.asString()) {
        console.warn('❌ No ad configuration found in Remote Config for key: ad_slots');
        return '';
      }

      // Parse the JSON config
      const configString = configValue.asString();
      console.log('📝 Raw config string:', configString);
      
      let jsonConfig;
      try {
        jsonConfig = JSON.parse(configString);
        console.log('✅ Parsed Remote Config:', jsonConfig);
      } catch (e) {
        console.error('❌ Failed to parse Remote Config JSON:', e);
        return '';
      }
      
      // Update cache
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(jsonConfig));
      } catch (e) {
        console.warn('Failed to cache ad config:', e);
      }

      // Log performance
      if (isDevelopment) {
        const duration = Math.round(performance.now() - startTime);
        console.log(`✅ Ad config fetched in ${duration}ms`);
      }

      // Return the requested value or the whole config
      return slotName ? (jsonConfig[slotName] || '') : JSON.stringify(jsonConfig);
      
    } catch (error) {
      console.error('Error fetching ad config:', error);
      return '';
    }
  } catch (error) {
    console.error('Error in getAdSlotId:', error);
    return '';
  }
};

export { analytics, app, remoteConfig };
