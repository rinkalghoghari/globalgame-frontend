"use client";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { getAdSlotId, logEvent, onAnalyticsReady } from "@/lib/firebaseConfig";
import { CgClose } from "react-icons/cg";
import { RiFullscreenLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaKeyboard, FaRegStar, FaStar } from "react-icons/fa";
import { commentAPI } from "@/utils/api/comment.api";
import { ratingAPI } from "@/utils/api/rating.api";
import GameWalkthrough from "@/components/Walkthrough";
import { showToast } from "@/components/ui/toast";

declare global {
  interface Window {
    timerId: NodeJS.Timeout | null;
  }
}
interface IGamesState {
  gameBox: boolean;
  addBox: boolean;
  countdown: number;
  adCompleted: boolean;
  category: string;
  gameId: string;
  gameUrl: string;
  gameImage: string;
  gameTitle: string;
  gameInstructions?: string;
  showGame: boolean;
  url: string;
  tags?: string;
  description?: string;
  difficulty?: string;
  gameControls?: { key: string; action: string }[];
}

const GAME_STATE_INITIAL: IGamesState = {
     gameBox: false,
    addBox: false,
    countdown: 5,
    adCompleted: false,
    gameId: "",
    gameUrl: "",
    gameImage: "",
    gameTitle: "",
    description: "",
    gameInstructions: "",
    category: "",
    tags: "",
    gameControls: [],
    url:"",
    showGame: false,
    difficulty: "easy",
};

interface GameControl {
  key: string;
  action: string;
}

interface Game {
  id: string;
  title: string;
  description: string,
  url: string;
  thumb: string;
  category: string;
  tags: string;
  instructions?: string;
  gameControls?: GameControl[]; 
}

interface Comment {
  gameId: string;
  name: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const keyboardControls = [
  { key: "Arrow Keys / WASD", action: "Move character" },
  { key: "Space", action: "Jump" },
  { key: "Shift", action: "Sprint" },
  { key: "Mouse", action: "Look around / Aim" },
  { key: "Left Click", action: "Primary action" },
  { key: "Right Click", action: "Secondary action" },
  { key: "E", action: "Interact" },
  { key: "Esc", action: "Pause menu" },
];

const difficultyLevels = {
  easy: { color: "bg-green-500", label: "Easy" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  hard: { color: "bg-orange-500", label: "Hard" },
  expert: { color: "bg-red-500", label: "Expert" },
};

const GameDetail = ({ games,similarGames }: { games: Game,similarGames: Game[] }) => {
      const [gamesState, setGamesState] = useState<IGamesState>(GAME_STATE_INITIAL);
  const [cameFromCategory, setCameFromCategory] = useState(false);
  const [cameFromPopular, setCameFromPopular] = useState(false);
  const [activeTab, setActiveTab] = useState<"comments" | "screenshots" | "walkthrough">("comments");
  const [, setAdSlots] = useState({
    bottomSlide: "",
    popup: "",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoadingRating, setIsLoadingRating] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const gameStartTime = useRef<number>(0);

  const searchParams = useSearchParams();
  const name = searchParams?.get('name');

  useEffect(() => {
    // Check where we came from (category or popular)
    if (typeof window !== 'undefined') {
      // Get the current URL search params
      const searchParams = new URLSearchParams(window.location.search);

      // Check for the fromPopular parameter that's being passed from the popular page
      const fromPopular = searchParams.get('fromPopular') !== null;

      // Check for the fromCategory parameter that's being passed from the category page
      const fromCategory = searchParams.get('fromCategory') !== null;

      // Also check document.referrer as fallback
      const referrer = document.referrer;
      const cameFromCategory = fromCategory || (referrer && referrer.includes('/category/'));
      const cameFromPopular = fromPopular || (referrer && referrer.includes('/popular/'));

      if (cameFromCategory) {
        setCameFromCategory(true);
      } else if (cameFromPopular) {
        setCameFromCategory(false);
        setCameFromPopular(true);
      }
    }
  }, []);

  // Handle ad completion
  // const handleAdComplete = useCallback(async () => {
  //   // Track ad completion
  //   await trackEvent('ad_complete', {
  //     game_id: gamesState.gameId,
  //     game_title: gamesState.gameTitle,
  //   });

  //   setGamesState(prev => ({
  //     ...prev,
  //     adCompleted: true,
  //     addBox: false,
  //     gameBox: true,
  //     showGame: true
  //   }));
  //   document.body.style.overflow = "hidden";

  //   // Track game start after ad completes
  //   await trackEvent('game_start', {
  //     game_id: gamesState.gameId,
  //     game_title: gamesState.gameTitle,
  //     category: gamesState.category,
  //   });
  // }, [gamesState.gameId, gamesState.gameTitle, gamesState.category]);

  // Video ads functionality commented out
  // useGameMonetizeVideo(gamesState.gameId, handleAdComplete);

  // Get game ID from URL params
  const params = useParams();
  const gameId = params?.id || "";

  const determineDifficulty = (category: string): string => {
    const difficultyMap: { [key: string]: string } = {
      Puzzle: "medium",
      Action: "hard",
      Adventure: "medium",
      Racing: "easy",
      Sports: "medium",
    };
    return difficultyMap[category] || "medium";
  };

  // Load comments from API
  const loadComments = async () => {
    if (!gameId) return;

    setIsLoadingComments(true);
    try {
      const response = await commentAPI.getComments(gameId as string);
      if (response.success) {
        setComments(response.data  || []);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Load rating statistics from API
  const loadRatingStats = async () => {
    if (!gameId) return;

    setIsLoadingRating(true);
    try {
      const response = await ratingAPI.getRatingStats(gameId as string);
      if (response.success) {
        setAverageRating(response.data.average || 0);
        setTotalRatings(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error loading rating stats:", error);
    } finally {
      setIsLoadingRating(false);
    }
  };

  // Check if user has already rated
  const checkUserRating = async () => {
    if (!gameId) return;

    try {
      const response = await ratingAPI.checkUserRating(gameId as string);
      if (response.success && response.data.hasRated) {
        setHasUserRated(true);
        setUserRating(response.data.rating);
      }
    } catch (error) {
      console.error("Error checking user rating:", error);
    }
  };

 useEffect(() => {
  if (!games || !gameId) return;

  const fetchGameData = async () => {
    try {
      setGamesState(prev => ({
        ...prev,
        gameId: games.id,
        gameUrl: games.url,
        gameImage: games.thumb,
        gameTitle: games.title,
        gameInstructions: games.instructions,
        category: games.category,
        tags: games.tags,
        description: games.description,
        url: games.url,
        gameControls: games.gameControls?.length
          ? games.gameControls
          : keyboardControls,
        difficulty: determineDifficulty(games.category),
      }));

      // Load rating + comments
      await loadComments();
      await loadRatingStats();
      await checkUserRating();

    } catch (error) {
      console.error("Error initializing game:", error);
    }
  };

  const fetchAdSlots = async () => {
    try {
      const adConfig = await getAdSlotId();
      if (!adConfig) return;

      const config = JSON.parse(adConfig);
      setAdSlots({
        bottomSlide: config.one_game_banner_slot_id || "",
        popup: config.one_game_popupSlot_Id || "",
      });
    } catch (error) {
      console.error("Error fetching ad slots:", error);
    }
  };

  fetchGameData();
  fetchAdSlots();

}, [games, gameId]);

  // useGameMonetizeVideo(gamesState.gameId, handleAdComplete);

  // Track analytics event with error handling
  type EventParams = {
    [key: string]: string | number | boolean | null | undefined;
  };

  const trackEvent = async (eventName: string, params: EventParams = {}) => {
    try {
      await onAnalyticsReady();
      logEvent(eventName, {
        ...params,
        page_location: window.location.href,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // const BoxOpeningHandler = (url: string, gameTitle: string) => {
  //   // Track game selection
  //   trackEvent('select_content', {
  //     content_type: 'game',
  //     item_id: url.split('/').pop() || 'unknown',
  //     item_name: gameTitle || 'Unknown Game',
  //     method: 'game_card_click',
  //     category: gamesState.category,
  //   });

  //   // Track game view
  //   trackEvent('view_item', {
  //     item_id: url.split('/').pop() || 'unknown',
  //     item_name: gameTitle || 'Unknown Game',
  //     item_category: gamesState.category,
  //   });

  //   setGamesState(prev => ({
  //     ...prev,
  //     url,
  //     addBox: true,
  //     countdown: 5
  //   }));
  //   document.body.style.overflow = "hidden";

  //   // Clear any existing timer
  //   if (window.timerId) {
  //     clearInterval(window.timerId);
  //   }

  //   // Start new countdown
  //   window.timerId = setInterval(() => {
  //     setGamesState(prev => {
  //       const newCountdown = prev.countdown - 1;
  //       if (newCountdown <= 0) {
  //         clearInterval(window.timerId!);
  //         window.timerId = null;
  //       }
  //       return { ...prev, countdown: newCountdown };
  //     });
  //   }, 1000);
  // }

  const BoxClosingHandler = () => {
    if (confirm("Are you sure you want to close the game box?")) {
      // Track game session end
      trackEvent('game_end', {
        game_id: gamesState.gameId,
        game_title: gamesState.gameTitle,
        duration: Math.floor((Date.now() - gameStartTime.current) / 1000),
      });

      setGamesState((prev) => ({ ...prev, gameBox: false }));
      document.body.style.overflow = "auto";
    }
  };

  const closeAd = useCallback(() => {
    // Cleanup timer on unmount
    return () => {
      if (window.timerId) {
        clearInterval(window.timerId);
      }
    };
  }, []);
  
  useEffect(closeAd, [closeAd]);

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button" 
             onClick={(e) => {
            e.preventDefault(); 
            if (interactive) handleRating(star);
           }}
            className={`${interactive ? "cursor-pointer hover:scale-110" : ""
              } transition-transform ${hasUserRated && interactive ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!interactive || hasUserRated}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const handleRating = (rating: number) => {
    if (hasUserRated) {
      return;
    }
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {

    setIsSubmittingRating(true);
    setIsSubmittingComment(true);

    try {
      const ratingResponse = await ratingAPI.addRating(
        gameId as string,
        userRating,
        userName.trim()
      );

      if (ratingResponse.success) {
        setHasUserRated(true);
        await loadRatingStats();

        // If there's a comment, submit it
        if (newComment.trim()) {
          try {
            const commentResponse = await commentAPI.addComment(
              gameId as string,
              userName.trim(),
              newComment.trim()
            );

            if (commentResponse.success) {
              await loadComments();
              setNewComment("");
              setShowCommentForm(false); // Hide comment form after successful submission
            }
          } catch (commentError) {
            console.error("Error submitting comment:", commentError);
            showToast("Rating submitted successfully, but comment failed. Please try adding a comment again.");
          }
        } else {
          // If no comment was added, show the comment form option
          setShowCommentForm(true);
        }

          showToast(
              newComment.trim()
                  ? "Thank you for your rating and review!"
                  : "Thank you for your rating!"
          );

      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting review:", error);
        showToast(error.message || "Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmittingRating(false);
      setIsSubmittingComment(false);
    }
  };

  const handleAddComment = async () => {
  setIsSubmittingComment(true);

  try {
    const commentResponse = await commentAPI.addComment(
      gameId as string,
      userName.trim(),
      newComment.trim()
    );

    if (commentResponse.success) {
      await loadComments();
      setNewComment("");
      setUserName("");
      setShowCommentForm(false);
      showToast("Thank you for your rating!");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting comment:", error);
      showToast("Failed to submit comment. Please try again.");
    }
  } finally {
    setIsSubmittingComment(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* {gamesState.addBox && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] bg-opacity-80 flex items-center justify-center z-[9999] p-4 overflow-y-auto transition-all duration-300">
            <div className="relative w-full max-w-md bg-transparent rounded-lg overflow-hidden transition-all duration-300">
              <div className="w-full h-[250px] md:h-[300px] bg-white/10 rounded-lg overflow-hidden">
                <GoogleAd 
                  className="w-full h-full"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  adSlot={adSlots.popup || undefined}
                />
              </div>
              <div className="flex flex-col items-center mt-8">
                <button
                  onClick={() => {
                    setGamesState({
                      ...gamesState,
                      addBox: false,
                      gameBox: true,
                    });
                  }}
                  className={`mx-auto px-8 py-4 rounded-full transition-all duration-300 w-[200px] md:w-[250px] ${
                    gamesState.countdown > 0
                      ? "font-bold text-4xl md:text-5xl bg-transparent"
                      : "bg-[#3390FF] hover:bg-[#2a7acc] text-2xl md:text-3xl cursor-pointer transform hover:scale-105"
                  } text-white shadow-lg`}
                  disabled={gamesState.countdown > 0}
                >
                  {gamesState.countdown > 0 ? gamesState.countdown : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )} */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="sticky top-0  py-3 mb-6 px-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {cameFromCategory && gamesState.category && (
                <>
                  <BreadcrumbSeparator>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href={`/category/${encodeURIComponent(gamesState.category)}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {gamesState.category} Games
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {cameFromPopular && (
                <>
                  <BreadcrumbSeparator>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href={`/popular/${name}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500 font-medium">
                  {gamesState.gameTitle || "Game"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>


        <div className="max-w-7xl mx-auto md:px-4  sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 md:p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-[22px] sm:text-2xl md:text-4xl font-bold text-white">
                  {gamesState.gameTitle}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-white mt-4">
                  <div className="flex items-center gap-2">
                    {isLoadingRating ? (
                      <span className="text-sm">Loading ratings...</span>
                    ) : (
                      <>
                        {renderStars(Math.round(averageRating))}
                        <span className="text-base sm:text-lg font-semibold">
                          {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-sm opacity-90">({totalRatings} ratings)</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-medium">Difficulty:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyLevels[
                          gamesState.difficulty as keyof typeof difficultyLevels
                        ]?.color
                        }`}
                    >
                      {
                        difficultyLevels[
                          gamesState.difficulty as keyof typeof difficultyLevels
                        ]?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 p-4 md:p-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm order-3 lg:order-1 lg:col-span-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                  About This Game
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <div className="leading-relaxed">
                    {gamesState.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: gamesState.description
                            .replace(/&amp;/g, "&")
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'"),
                        }}
                      />
                    ) : (
                      "No description available for this game. Enjoy the gameplay!"
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 order-1 lg:order-2">
                <div className="relative aspect-video w-full">
                  <Image
                    src={gamesState.gameImage || "/placeholder-game.jpg"}
                    alt={gamesState.gameTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-4">
                  <button
                    onClick={() => {
                      setGamesState({
                        ...gamesState,
                        addBox: false,
                        gameBox: true,
                      });
                      gameStartTime.current = Date.now();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base text-white font-medium py-2 sm:py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Play Now
                  </button>
                </div>
              </div>

              {gamesState.gameInstructions && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm order-2 lg:order-3 lg:col-span-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
                    How to Play ?
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    <div className="whitespace-pre-line">
                      {gamesState.gameInstructions
                        .replace(/&bull;|•/g, "•")
                        .replace(/&bull;|•/g, "\n• ")
                        .trim()}
                    </div>
                  </div>
                </div>
              )}

              {gamesState.tags && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm order-4 lg:order-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gamesState.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gamesState.gameId && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm order-6 lg:order-6 lg:col-span-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4 flex items-center gap-2">
                    <FaKeyboard /> Game Controls
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Key
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">

                        {/* Use gameControls if available, otherwise fall back to default controls */}
                        {(gamesState.gameControls && gamesState?.gameControls?.length > 0 ? gamesState.gameControls : keyboardControls).map((control, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-nowrap">
                              <code className="px-2 py-1 bg-gray-100 rounded text-blue-600 font-mono">
                                {control.key}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-nowrap text-gray-700">
                              {control.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {gamesState.category && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm order-6 lg:order-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gamesState.category.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm order-5 lg:col-span-3">
              <div className="border-b border-gray-200">
                <div className="flex gap-4 px-6">
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "comments"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Comments
                  </button>
                  <button
                    onClick={() => setActiveTab("walkthrough")}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "walkthrough"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Walkthrough
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                  {activeTab === "comments" && (
                    <div className="space-y-6">
                      {/* Unified Rating & Comment Form */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <h3 className="text-xl font-bold text-gray-900">
                            {hasUserRated ? "Rating Submitted!" : "Rating & Comment This Game"}
                          </h3>
                        </div>

                        {!hasUserRated ? (
                          <form onSubmit={(e) => { e.preventDefault(); handleSubmitReview(); }} className="space-y-4">
                            {/* Star Rating */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Rating *
                              </label>
                              <div className="flex items-center gap-3">
                                {renderStars(userRating, true)}
                                {userRating > 0 && (
                                  <span className="text-sm font-medium text-gray-600">
                                    {userRating}/5 {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][userRating]}
                                  </span>
                                )}
                              </div>
                              {userRating === 0 && (
                                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Please select a rating
                                </p>
                              )}
                            </div>

                            {/* Username Input */}
                            <div>
                              <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Name *
                              </label>
                              <input
                                id="userName"
                                type="text"
                                placeholder="Enter your name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={isSubmittingRating}
                                maxLength={50}
                                required
                              />
                            </div>

                            {/* Comment Textarea (Optional) */}
                            <div>
                              <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Comment
                              </label>
                              <textarea
                                id="comment"
                                placeholder="Share your thoughts about this game..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                disabled={isSubmittingRating}
                                maxLength={500}
                              />
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-500">
                                  Optional: Add a detailed review to help other players
                                </p>
                                <p className="text-xs text-gray-500">
                                  {newComment?.length}/500
                                </p>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <button
                              type="submit"
                              disabled={isSubmittingRating || userRating === 0 || !userName.trim()}
                              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                              {isSubmittingRating ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                  </svg>
                                  Submit {newComment.trim() ? "Rating & Review" : "Rating"}
                                </>
                              )}
                            </button>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            {/* Success Message */}
                            <div className="text-center py-4">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                Thank You for Rating!
                              </h4>
                              <p className="text-gray-600 text-sm">
                                Your {userRating}-star rating has been recorded
                              </p>
                            </div>

                            {/* Show "Add Comment" button or comment form */}
                            {!showCommentForm ? (
                              <button
                                onClick={() => setShowCommentForm(true)}
                                className="w-full px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Add a Comment
                              </button>
                            ) : (
                              <div className="border-t border-gray-300 pt-4">
                                <h4 className="text-base font-semibold text-gray-900 mb-3">
                                  Add Your Comment
                                </h4>
                                <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="space-y-3">
                                  <div>
                                    <label htmlFor="commentUserName" className="block text-sm font-semibold text-gray-700 mb-2">
                                      Your Name *
                                    </label>
                                    <input
                                      id="commentUserName"
                                      type="text"
                                      placeholder="Enter your name"
                                      value={userName}
                                      onChange={(e) => setUserName(e.target.value)}
                                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                      disabled={isSubmittingComment}
                                      maxLength={50}
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label htmlFor="commentText" className="block text-sm font-semibold text-gray-700 mb-2">
                                      Your Comment *
                                    </label>
                                    <textarea
                                      id="commentText"
                                      placeholder="Share your thoughts about this game..."
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      rows={4}
                                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                      disabled={isSubmittingComment}
                                      maxLength={500}
                                      required
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                      {newComment?.length}/500
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      onClick={() => {
                                        setShowCommentForm(false);
                                        setNewComment("");
                                        setUserName("");
                                      }}
                                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                                      disabled={isSubmittingComment}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={isSubmittingComment || !userName.trim() || !newComment.trim()}
                                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                      {isSubmittingComment ? (
                                        <>
                                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                          Posting...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                          </svg>
                                          Post Comment
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comments List Section - Same as before */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <h3 className="text-xl font-bold text-gray-900">
                            User Reviews ({comments?.length})
                          </h3>
                        </div>

                        {isLoadingComments ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-gray-500">
                              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Loading reviews...</span>
                            </div>
                          </div>
                        ) : comments?.length === 0 ? (
                          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                            <p className="text-gray-600">Be the first to share your thoughts about this game!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {comments.map((comment, index) => (
                              <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {comment.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-gray-900 text-base">
                                          {comment.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-xs text-gray-500">{comment.createdAt}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {activeTab === "walkthrough" && (
                  <>
                    {/* Video Walkthrough Section */}
                   <div className="max-w-4xl mx-auto py-4 sm:y-6 md:py-8 lg:py-10">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-blue-600">
                        Game Walkthrough Video
                      </h1>

                      <p className="text-gray-600 mb-4">
                        Watch the full walkthrough video to master the game.
                      </p>

                      {/* Walkthrough Video */}
                      <GameWalkthrough
                        gameId={gamesState.gameId}
                        width="100%"
                        height="480px"
                        color="#3f007e"
                        gameTitle={gamesState.gameTitle}
                        getAds={true}
                      />

                     <p className="mt-4 sm:mt-6 text-gray-500 text-sm">
                        This walkthrough is powered by GameMonetize and helps generate ad revenue.
                      </p>
                    </div>

                      {/* Step-by-Step Written Guide */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">
                          📖 Step-by-Step Guide
                        </h2>

                        <div className="space-y-6">

                          {/* Step 1 */}
                          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                              1. Getting Started
                            </h3>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">
                              Begin your adventure in {gamesState.gameTitle} by learning how the game works and understanding the essential controls.
                            </p>
                            <ul className="space-y-1 text-gray-600 text-sm sm:text-base">
                              <li>• Review basic controls such as mouse actions, taps, or keyboard movement keys</li>
                              <li>• Get comfortable with simple actions like moving, selecting, or drawing</li>
                              <li>• Explore the main menu and understand available options</li>
                            </ul>
                          </div>

                          {/* Step 2 */}
                          <div className="border-l-4 border-green-500 pl-3 sm:pl-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                              2. Early Game Strategy
                            </h3>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">
                              Build a strong foundation by practicing core mechanics and staying aware of your surroundings.
                            </p>
                            <ul className="space-y-1 text-gray-600 text-sm sm:text-base">
                              <li>• Take time to observe how the game world reacts to your moves</li>
                              <li>• Collect helpful items and bonuses whenever possible</li>
                              <li>• Progress at a steady pace—avoid rushing through levels</li>
                              <li>• Practice completing early challenges to build confidence</li>
                            </ul>
                          </div>

                          {/* Step 3 */}
                          <div className="border-l-4 border-purple-500 pl-3 sm:pl-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                              3. Advanced Techniques
                            </h3>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">
                              Once you understand the basics, try improving your performance with more advanced gameplay techniques.
                            </p>
                            <ul className="space-y-1 text-gray-600 text-sm sm:text-base">
                              <li>• Learn efficient movement patterns for smoother gameplay</li>
                              <li>• Memorize level layouts and paths for better results</li>
                              <li>• Use timing-based actions to increase accuracy</li>
                              <li>• Discover helpful mechanics unique to {gamesState.gameTitle}</li>
                            </ul>
                          </div>

                          {/* Step 4 */}
                          <div className="border-l-4 border-orange-500 pl-3 sm:pl-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                              4. Pro Tips & Secrets
                            </h3>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">
                              Enhance your gameplay with expert tips that help you perform better and enjoy the game more.
                            </p>
                            <ul className="space-y-1 text-gray-600 text-sm sm:text-base">
                              <li>• Practice tricky sections repeatedly to improve skill</li>
                              <li>• Experiment with different strategies to find what works best</li>
                              <li>• Share your progress with friends and compare achievements</li>
                            </ul>
                          </div>

                        </div>
                      </div>

                  </>
                )}
              </div>
            </div>
          </div>
          </div>

          {similarGames?.length > 0 && (
            <div className="border-t border-gray-100 py-6 md:p-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  More {gamesState.category} Games
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {similarGames?.map((game,index) => (
                    <Link href={`/${game.id}`} key={index} className="group block">
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 h-full flex flex-col">
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src={game.thumb || "/placeholder-game.jpg"}
                            alt={game.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                            {game.title}
                          </h3>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {game.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                              Play
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {(gamesState.gameBox || gamesState.showGame) && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="relative w-full max-w-6xl h-[90vh] bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={() => {
                    if (iframeRef.current && iframeRef.current.requestFullscreen) {
                      iframeRef.current.requestFullscreen();
                    }
                  }}
                  className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
                  title="Fullscreen"
                >
                  <RiFullscreenLine size={20} />
                </button>
                <button
                  onClick={BoxClosingHandler}
                  className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                  title="Close"
                >
                  <CgClose size={20} />
                </button>
              </div>
              <iframe
                ref={iframeRef}
                src={gamesState.url}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default GameDetail;
