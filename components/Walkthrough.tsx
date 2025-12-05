
import React, { useEffect } from 'react';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    walkthrough?: {
      gameId: string;
      width: string;
      height: string;
      color: string;
      getAds: boolean;
    };
  }
}

interface WalkthroughProps {
   gameId: string;
      width: string;
      height: string;
      color: string;
      getAds: boolean;
      gameTitle:string
}

const GameWalkthrough: React.FC<WalkthroughProps> = ({ gameId , gameTitle}) => {
  // Load GameMonetize walkthrough script
  useEffect(() => {
    if (!gameId) return;

    // Define walkthrough config
    window.walkthrough = {
      gameId: gameId,
      width: "100%",
      height: "500",
      color: "#3f007e",
      getAds: true
    };

    // Load the walkthrough script
    const script = document.createElement('script');
    script.src = 'https://gamemonetize.com/walkthrough.js';
    script.async = true;
    script.id = `gamemonetize-walkthrough-script-${gameId}`;
    
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const scriptElement = document.getElementById(`gamemonetize-walkthrough-script-${gameId}`);
      if (scriptElement) {
        scriptElement.remove();
      }
      
      // Clear the walkthrough container
      const container = document.getElementById('gamemonetize-walkthrough');
      if (container) {
        container.innerHTML = '';
      }
      
      delete window.walkthrough;
    };
  }, [gameId]);

  return (
   <div className="bg-white rounded-xl p-0 sm:p-6 sm:border border-gray-100 sm:shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
        🎥 Video Walkthrough
      </h2>
      <p className="text-gray-700 mb-4">
        Watch this complete walkthrough video to master {gameTitle}. Learn all the tricks, strategies, and secrets!
      </p>
      
      {/* Walkthrough Container */}
      <div className="w-full rounded-lg overflow-hidden bg-gray-900 relative mb-4" style={{ minHeight: '500px' }}>
        {gameId ? (
          <div id="gamemonetize-walkthrough"></div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">Walkthrough video coming soon!</p>
            </div>
          </div>
        )}
      </div>
      
      {/* AdSense Ad Slot - Below Video */}
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXX"
             data-ad-slot="YYYYYYYYYY"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
      
      {/* Walkthrough Info */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
        <p className="text-sm text-gray-700">
          💡 <strong>Note:</strong> This walkthrough is powered by GameMonetize and includes monetization. You earn 80% revenue from ads shown in the video player.
        </p>
      </div>
    </div>
  );
};

export default GameWalkthrough;


