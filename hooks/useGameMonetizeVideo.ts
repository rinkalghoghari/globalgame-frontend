// useGameMonetizeVideo.ts
"use client";

import { useEffect, useRef } from 'react';

interface VideoOptions {
  gameid: string;
  width: string;
  height: string;
  color: string;
  getAds: string;
  onStart?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

declare global {
  interface Window {
    VIDEO_OPTIONS?: VideoOptions;
  }
}

const useGameMonetizeVideo = (gameId: string, onAdComplete?: () => void) => {
  const adInitialized = useRef(false);
  
  useEffect(() => {
    // Only run on client side and if we have a gameId
    if (!gameId || typeof window === 'undefined') return;

    // Skip if already initialized
    if (adInitialized.current) return;
    adInitialized.current = true;

    // Set video options with callbacks
    (window as any).VIDEO_OPTIONS = {
      gameid: gameId,
      width: "100%",
      height: "300px",
      color: "#3f007e",
      getAds: "true",
      onStart: () => {
      },
      onComplete: () => {
        onAdComplete?.();
        cleanup();
      },
      onSkip: () => {
        onAdComplete?.();
        cleanup();
      }
    };

    // Load jQuery first, then GameMonetize script
    const loadScripts = async () => {
      try {
        // Remove any existing video container
        const existingContainer = document.getElementById('gamemonetize-video');
        if (existingContainer) {
          existingContainer.innerHTML = ''; // Clear any existing content
        }

        // Load jQuery first if not already loaded
        if (!document.getElementById('jquery')) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.id = 'jquery';
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        // Then load GameMonetize script
        if (!document.getElementById('gamemonetize-video-api')) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.id = 'gamemonetize-video-api';
            script.src = 'https://api.gamemonetize.com/video.js';
            script.onload = () => {
              // After script loads, we need to wait a bit for it to initialize
              setTimeout(resolve, 500);
            };
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
        // If there's an error, still try to proceed with the game
        onAdComplete?.();
      }
    };

    const cleanup = () => {
      const jqueryScript = document.getElementById('jquery');
      if (jqueryScript) {
        jqueryScript.remove();
      }
      
      const gameMonetizeScript = document.getElementById('gamemonetize-video-api');
      if (gameMonetizeScript) {
        gameMonetizeScript.remove();
      }
      
      // Clean up the video container
      const videoContainer = document.getElementById('gamemonetize-video');
      if (videoContainer) {
        videoContainer.innerHTML = '';
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      cleanup();
    };
  }, [gameId, onAdComplete]);

  return null;
};

export default useGameMonetizeVideo;
