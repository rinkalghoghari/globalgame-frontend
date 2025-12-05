"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdSlotId } from "@/lib/firebaseConfig";
import Image from "next/image";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { gamesAPI } from "@/utils/api/games.api";
// Game Card Component
// const GameCard = ({ game }: { game: typeof games[0] }) => (
//   <Link href={`/${game.id}`}>
//     <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
//       <div className="relative h-48 md:h-56 w-full">
//         <Image
//           src={game.thumb || "/placeholder-game.jpg"}
//           alt={game.title}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-300"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
//           <h3 className="text-white font-bold text-lg line-clamp-1">{game.title}</h3>
//           <div className="flex justify-between items-center mt-1">
//             <span className="text-sm text-gray-200">{game.category}</span>
//             <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
//               {Math.floor(Math.random() * 10  ) + 10}K plays
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </Link>
// );
interface Game {
    id: string;
    title: string;
    description:string,
    url: string;
    thumb: string;
    category: string;
    tags: string;
    instructions?: string;
  }

export default function Home() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [, setAddBox] = useState<boolean>(false);
  const [, setAdSlots] = useState({
    popup: '',
    topBanner: '',
    bottomSlide: '',
    // Add more ad slots as needed
  });

  useEffect(() => {
        async function loadGames() {
          const data = await gamesAPI.getGames();
          setGames(data?.data || []);
        }
        loadGames();
      }, []);

  // Fetch ad slots from Firebase Remote Config
  useEffect(() => {
    const fetchAdSlots = async () => {
      try {
        // You can fetch multiple ad slots at once
        const [popupSlot, topBannerSlot, bottomSlideSlot] = await Promise.all([
          getAdSlotId('popupSlot_Id'),
          getAdSlotId('Home_Top_ad_slot_id'),
          getAdSlotId('Bottom_slide_slot_id')
        ]);
        
        setAdSlots({
          popup: popupSlot,
          topBanner: topBannerSlot,
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
      setAddBox(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // const closeAd = () => {
  //   setAddBox(false);
  // };

  const handleViewMore = (category: string) => {
    router.push(`/category/${category}`);
  };

  // Mouse parallax effect
  

  return (
    <>
      <PageTransition>
        {/* Google Ad will use the ad slot ID from Firebase Remote Config */}
      
        {/* <SlidingAdCard
          showOnMount={true} // Set to false if you want to control visibility manually
          delay={2000} // Delay in ms before showing the ad
          onClose={() => {
            // Handle close event
          }}
        /> */}
        {/* {addBox && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 ">
            <div className="relative w-full max-w-md bg-transparent rounded-lg overflow-hidden transition-all duration-300">
              <div className="bg-white/15 backdrop-blur-[2px] w-full h-[30vh] border border-white rounded-lg mx-auto relative transition-all duration-300">
                <button
                  onClick={closeAd}
                  className="absolute top-2 right-2 p-1 bg-black/80 rounded-full hover:bg-black transition-colors z-10"
                  aria-label="Close ad"
                >
                  <CgClose size={20} className="text-white cursor-pointer" />
                </button>
                <div className="w-full h-full">
                  <GoogleAd
                    adSlot={adSlots.popup || undefined} // Will use Remote Config if empty
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div> 
        )} */}

          {/* Welcome Section */}
         <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-12">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Play Free Online Games Anytime, Anywhere</h1>
              <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">Global Games offers a large collection of free online games across every category. All games are browser-friendly, safe to play, and carefully reviewed to give you the best gaming experience. Enjoy guides, tips, and gameplay insights for every title.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => window.scrollTo({top: document.getElementById('featured-games')?.offsetTop, behavior: 'smooth'})}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 h-[52px]"
                >
                  Play Now
                </button>
                <button 
                  onClick={() => window.scrollTo({top: document.getElementById('categories')?.offsetTop, behavior: 'smooth'})}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300 h-[52px]"
                >
                  Explore Games
                </button>
              </div>
            </div>
          </div>
          {/* <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <div className="w-full h-32 md:h-40 lg:h-48 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <GoogleAd
                adSlot={adSlots.topBanner || undefined} // Will use Remote Config if empty
                className="w-full h-full"
                style={{ minHeight: "8rem" }}
              />
            </div>
          </div> */}

          {/* Categories Section */}
          <div id="categories" className="w-full">
          {[
            "Best Games",
            "Racing",
            "Adventure",
            "Puzzles",
            "Action",
            "Strategy",
            "Arcade",
            "Girls",
            "Boys",
            "New Arrivals"
          ].map((category) => {
            const categoryGames = games?.filter(
              (game) => game.category === category
            );
            if (categoryGames?.length === 0) return null;

            return (
              <div
                key={category}
                className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-8"
              >
                <div className="w-full px-2 mb-3">
                  <div className="flex items-center justify-between " id="featured-games">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1 h-6 rounded-full ${
                        category === 'Best Games' ? 'bg-yellow-500' : 
                        category === 'Racing' ? 'bg-red-500' :
                        category === 'Adventure' ? 'bg-green-500' :
                        category === 'Puzzles' ? 'bg-purple-500' :
                        category === 'Action' ? 'bg-red-600' :
                        category === 'Strategy' ? 'bg-blue-500' :
                        category === 'Arcade' ? 'bg-pink-500' :
                        category === 'Girls' ? 'bg-pink-400' :
                        'bg-blue-400' // Default color for other categories
                      }`}></div>
                      <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                    </div>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-1 rounded-full cursor-pointer text-sm md:text-base"
                      onClick={() => handleViewMore(category)}
                    >
                      View More
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {categoryGames?.slice(0, 4).map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                        scale: 1.02,
                        cursor: "pointer",
                      }}
                      className="h-full flex flex-col"
                    >
                      <Link
                        href={`/${game.id}`}
                        className="flex flex-col h-full text-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                      >
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            unoptimized
                            src={game.thumb}
                            alt={game.title}
                            width={500}
                            height={375}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col flex-grow p-3 sm:p-4">
                          <h3 className="text-base font-semibold text-black text-center line-clamp-2 h-10 sm:h-12 flex items-center justify-center">
                            {game.title}
                          </h3>
                          <div className="flex-grow">
                            <div 
                              className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 text-center"
                              dangerouslySetInnerHTML={{ 
                                __html: game.description 
                                  ?.replace(/&amp;/g, '&')
                                  ?.replace(/&lt;/g, '<')
                                  ?.replace(/&gt;/g, '>')
                                  ?.replace(/&quot;/g, '"')
                                  ?.replace(/&#39;/g, "'") || ''
                              }} 
                            />
                          </div>
                          <button 
                            className="mt-2 sm:mt-3 w-full bg-blue-400 hover:bg-blue-700 cursor-pointer text-white py-2 px-2 text-xs sm:text-sm rounded-md transition-colors duration-200"
                            // onClick={(e) => e.preventDefault()}
                          >
                            Play Now
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Newsletter Section */}
          <div className="w-full bg-gray-50 py-12 mt-8 sm:mt-12 md:mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated!</h2>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter and be the first to know about new games and special offers.</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="w-[122px] bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
        </div>
      </PageTransition>
    </>
  );
}
