import React, { useEffect, useState, useContext, createContext } from 'react';
import { getAdSlotId } from '@/lib/firebaseConfig';

// Create a context for GDPR consent
type ConsentContextType = {
  hasConsent: boolean;
  setConsent: (value: boolean) => void;
  consentState: {
    consentGiven: boolean;
    preferences: {
      necessary: boolean;
      analytics: boolean;
      advertising: boolean;
      preferences: boolean;
    };
    lastUpdated: string;
  } | null;
};

export const GDPRConsentContext = createContext<ConsentContextType>({
  hasConsent: false,
  setConsent: () => {},
  consentState: null,
});

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

// Define the props interface for type safety
interface GoogleAdProps {
  // The ad slot ID from Google AdSense or the key for Remote Config
  adSlot?: string;
  // Optional custom class name for styling
  className?: string;
  // Optional style object for inline styling
  style?: React.CSSProperties;
  // Optional config key to fetch from Remote Config
  configKey?: string;
}

/**
 * GoogleAd Component
 * A reusable component for displaying Google AdSense advertisements
 * 
 * Features:
 * - Responsive ad container
 * - Dynamic ad slot loading from props or Remote Config
 * - Error handling for ad loading
 * - TypeScript support
 * - Customizable through props
 */
const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot: propAdSlot,
  className = '',
  style = {},
  configKey = 'ad_slot_id' // Default config key
}) => {
  const [adSlot, setAdSlot] = useState(propAdSlot || '');
  const [, setIsLoading] = useState(!propAdSlot);
  const [, setError] = useState<string | null>(null);
  // Fetch ad slot from Remote Config if not provided
  useEffect(() => {
    const fetchAdSlot = async () => {
      if (propAdSlot) {
        console.log('Using prop ad slot:', propAdSlot);
        setAdSlot(propAdSlot);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching ad slot from Remote Config with key:', configKey);
        const slotId = await getAdSlotId(configKey);
        
        if (slotId) {
          console.log('✅ Fetched ad slot from Remote Config:', {
            slotId,
            length: slotId.length,
            type: typeof slotId
          });
          setAdSlot(slotId);
          setError(null);
        } else {
          console.warn(`⚠️ No ad slot found for key: ${configKey}`);
          setError(`Ad configuration not found for key: ${configKey}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load ad slot';
        console.error('❌ Error loading ad slot:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdSlot();
  }, [propAdSlot, configKey]);

  // Get GDPR consent context
  const { consentState } = useContext(GDPRConsentContext);

  // Check if advertising consent is given
  const hasAdvertisingConsent = consentState?.preferences?.advertising === true;

  // Handle ad initialization
  useEffect(() => {
    if (!adSlot) {
      console.log('Ad slot not available yet');
      return;
    }

    // Only initialize ads if user has given consent
    if (hasAdvertisingConsent) {
      console.log('Initializing ad with slot:', adSlot);
      
      // Initialize adsbygoogle if not already loaded
      const initAds = () => {
        try {
          if (!window.adsbygoogle) {
            console.log('Initializing adsbygoogle array');
            window.adsbygoogle = [];
          }
          
          // Push new ad config
          console.log('Pushing ad config to adsbygoogle');
          window.adsbygoogle.push({});
          console.log('Ad initialization complete');
        } catch (error) {
          console.error('AdSense error:', error);
        }
      };

      // If adsbygoogle script is already loaded, initialize immediately
      if (window.adsbygoogle) {
        initAds();
      } else {
        // Otherwise, wait for the script to load
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.onload = initAds;
        document.head.appendChild(script);
      }
    } else {
      console.log('Ad not loaded - user has not given advertising consent');
    }
  }, [adSlot, hasAdvertisingConsent]); // Re-run when adSlot or consent changes

  // if (!adSlot) {
  //   return null; // Don't render ad if no slot or no advertising consent
  // }

  // Demo styles - these will be shown in development
  const demoStyles: React.CSSProperties = {
    margin: '20px 0',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    border: '2px dashed #dee2e6',
    borderRadius: '8px',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#6c757d',
    ...style // Merge with any custom styles passed as props
  };

  return (
    <div className={`google-ad ${className}`} style={demoStyles}>
      {/* Demo content - will be replaced with actual ad in production */}
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Advertisement - Slot: {adSlot}
      </div>
      <div style={{ fontSize: '0.85rem' }}>
        This is a demo ad. In production, Google AdSense ads will appear here.
      </div>
      
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
     
    </div>
  );
};

export default GoogleAd;
