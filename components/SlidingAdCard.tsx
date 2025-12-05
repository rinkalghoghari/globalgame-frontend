"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdSlotId } from "@/lib/firebaseConfig";

interface SlidingAdCardProps {
  onClose?: () => void;
  showOnMount?: boolean;
  delay?: number;
}

const SlidingAdCard: React.FC<SlidingAdCardProps> = ({
  showOnMount = true,
  delay = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [, setAdSlots] = useState({
    bottomSlide: '',
  });

  useEffect(() => {
    
    const fetchAdSlots = async () => {
      try {
        const bottomSlideSlot = await getAdSlotId('Bottom_slide_slot_id');
        setAdSlots({
          bottomSlide: bottomSlideSlot
        });
      } catch (error) {
        console.error('Error fetching ad slots:', error);
      }
    };
    fetchAdSlots();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showOnMount) {
        setIsVisible(true);
        if (!isMinimized) {
          document.body.style.overflow = "auto";
        }
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [delay, showOnMount,isMinimized]);

  const toggleMinimize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newMinimized = !isMinimized;

    // Update the state
    setIsMinimized(newMinimized);

    // Update scroll behavior based on minimized state
    if (newMinimized) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="sliding-ad-card fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl "
          initial={{ y: "100%", height: 0 }}
          animate={{
            y: 0,
            height: isMinimized ? 10 : 256, // 16rem = 256px, 4rem = 64px
          }}
          exit={{ y: "100%", height: 0 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            mass: 0.5,
            bounce: 0.2,
            duration: 0.3,
          }}
        >
          <div className="relative w-full h-full bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg rounded-t-lg ">
            {/* Header - Always visible */}
            <div
              className="h-8 relative flex items-center justify-center px-6 cursor-pointer"
              onClick={toggleMinimize}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FAFAFA] rounded px-7 p-1 shadow-md">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize();
                  }}
                  className="p-1 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMinimized ? "Show" : "Hide"}
                >
                  <motion.span
                    animate={{ rotate: isMinimized ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-800"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.span>
                </motion.button>
              </div>
            </div>

            {/* Ad Content - Only show when not minimized */}
            {/* {!isMinimized && (
              <div className="h-[calc(100%-4rem)] w-full flex items-center justify-center p-4">
                <div className="w-full h-full max-w-md mx-auto">
                  <GoogleAd
                    className="w-full h-full"
                    adSlot={adSlots.bottomSlide || undefined}
                  />
                </div>
              </div>
            )} */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlidingAdCard;
