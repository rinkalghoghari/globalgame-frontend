"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
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

const features = [
  {
    id: 1,
    title: "Hand-Curated Game Library",
    description:
      `Every game on our platform undergoes a rigorous review process. Our dedicated team personally tests each title to ensure it meets our high standards for gameplay quality, entertainment value, and user experience. We don't just add games randomly. we carefully select titles that offer genuine fun and engagement.`,
    colors: {
      from: "from-blue-50",
      to: "to-blue-100",
      border: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
      iconBg: "from-blue-600 to-blue-700",
      text: "text-blue-900",
      hoverText: "group-hover:text-blue-700",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },

  {
    id: 2,
    title: "Comprehensive Game Guides",
    description:
      `We go beyond just hosting games. Our expert writers create detailed guides, strategic tips, and complete walkthroughs to help you master every game. Whether you're a beginner learning the basics or an experienced player seeking advanced strategies, our guides provide valuable insights.`,
    colors: {
      from: "from-purple-50",
      to: "to-purple-100",
      border: "border-purple-200",
      hoverBorder: "hover:border-purple-400",
      iconBg: "from-purple-600 to-purple-700",
      text: "text-purple-900",
      hoverText: "group-hover:text-purple-700",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
  },

  {
    id: 3,
    title: "Safe & Family-Friendly",
    description:
      `Your safety and privacy are our top priorities. All games are screened for appropriate content, and we maintain a secure browsing environment. Parents can feel confident letting their children explore our gaming library, knowing that every title has been vetted for age-appropriate content.`,
    colors: {
      from: "from-green-50",
      to: "to-green-100",
      border: "border-green-200",
      hoverBorder: "hover:border-green-400",
      iconBg: "from-green-600 to-green-700",
      text: "text-green-900",
      hoverText: "group-hover:text-green-700",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },

  {
    id: 4,
    title: "Lightning-Fast Performance",
    description:
      `Experience smooth and instant gameplay with our highly optimized platform. Pages load quickly, interactions feel responsive, and you can jump into your favorite games without delays. Enjoy a seamless experience whether you're on desktop or mobile.`,
    colors: {
      from: "from-orange-50",
      to: "to-orange-100",
      border: "border-orange-200",
      hoverBorder: "hover:border-orange-400",
      iconBg: "from-orange-600 to-orange-700",
      text: "text-orange-900",
      hoverText: "group-hover:text-orange-700",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
];

const gameCategories = [
  {
    id: 1,
    title: "Action Games",
    description:
      "Experience adrenaline-pumping challenges that test your reflexes, timing, and strategic thinking. From platformers to combat games, our action category delivers non-stop excitement.",
    colors: {
      from: "from-red-50",
      to: "to-red-100",
      border: "border-red-200",
      hover: "hover:border-red-400",
      bg: "bg-red-600",
      text: "text-red-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },

  {
    id: 2,
    title: "Racing Games",
    description:
      "Feel the thrill of high-speed competition with our collection of racing titles. Master tight corners, perfect your timing, and compete for the fastest lap times.",
    colors: {
      from: "from-yellow-50",
      to: "to-yellow-100",
      border: "border-yellow-200",
      hover: "hover:border-yellow-400",
      bg: "bg-yellow-600",
      text: "text-yellow-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },

  {
    id: 3,
    title: "Puzzle Games",
    description:
      "Challenge your mind with clever puzzles that range from relaxing match-three games to complex logic challenges requiring creative problem-solving.",
    colors: {
      from: "from-purple-50",
      to: "to-purple-100",
      border: "border-purple-200",
      hover: "hover:border-purple-400",
      bg: "bg-purple-600",
      text: "text-purple-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    ),
  },

  {
    id: 4,
    title: "Adventure Games",
    description:
      "Embark on epic journeys filled with exploration, storytelling, and discovery. Our adventure games transport you to fantastical worlds and engaging narratives.",
    colors: {
      from: "from-green-50",
      to: "to-green-100",
      border: "border-green-200",
      hover: "hover:border-green-400",
      bg: "bg-green-600",
      text: "text-green-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },

  {
    id: 5,
    title: "Sports Games",
    description:
      "Jump into fast-paced sports action with our collection of football, racing-inspired games. Test your reactions, timing, and competitive spirit across a wide range of exciting sports challenges.",
    colors: {
      from: "from-blue-50",
      to: "to-blue-100",
      border: "border-blue-200",
      hover: "hover:border-blue-400",
      bg: "bg-blue-600",
      text: "text-blue-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
  },

  {
    id: 6,
    title: "And Many More!",
    description:
      "Explore arcade classics, sports simulations, educational games, and specialized categories for different age groups and interests.",
    colors: {
      from: "from-pink-50",
      to: "to-pink-100",
      border: "border-pink-200",
      hover: "hover:border-pink-400",
      bg: "bg-pink-600",
      text: "text-pink-900",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    ),
  },
];



export default function Home() {
  const router = useRouter();
  // const [, setAddBox] = useState<boolean>(false);
  // const [, setAdSlots] = useState({
  //   popup: '',
  //   topBanner: '',
  //   bottomSlide: '',
  //   // Add more ad slots as needed
  // });

  // Fetch ad slots from Firebase Remote Config
  // useEffect(() => {
  //   const fetchAdSlots = async () => {
  //     try {
  //       // You can fetch multiple ad slots at once
  //       const [popupSlot, topBannerSlot, bottomSlideSlot] = await Promise.all([
  //         getAdSlotId('popup_ad_slot'),
  //         getAdSlotId('top_banner_ad_slot'),
  //         getAdSlotId('bottom_slide_slot')
  //       ]);
  //       setAdSlots({
  //         popup: popupSlot,
  //         topBanner: topBannerSlot,
  //         bottomSlide: bottomSlideSlot
  //       });
  //     } catch (error) {
  //       console.error('Error fetching ad slots:', error);
  //     }
  //   };

  //   fetchAdSlots();
  // }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setAddBox(true);
  //   }, 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  // const closeAd = () => {
  //   setAddBox(false);
  // };


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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Global Games</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">Global Games is the best destination for high-quality online games with no downloads. We hand-review every game and provide guides, tips, and walkthroughs.</p>
            <div className="flex flex-wrap justify-center gap-4">

              <button
                onClick={() => router.push('/games')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-full font-semibold transition-all duration-300"
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


        {/* About Section - RICH CONTENT FOR ADSENSE */}
        <div id="about-section" className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Heading with Decorative Elements */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] xl:text-5xl font-bold text-gray-900 mb-4 relative">
                  Your Premier Destination for
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Online Gaming</span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </h2>
              </div>
              <p className="text-lg md:text-xl text-gray-600 mt-4 sm:mt-6 max-w-3xl mx-auto">
                Discover a huge collection of hand-picked games, expert guides, and a gaming community that never stops growing
              </p>
            </div>

            {/* Introduction Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-9 md:p-12 mb-12 border border-gray-100">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 text-center max-w-5xl mx-auto">
                {"Global Games is the ultimate destination for high-quality online gaming experiences accessible directly from your browser. We are committed to providing players worldwide with an exceptional collection of free games that require no downloads, no installations, and no complicated setup processes. Whether you're looking for a quick gaming break during lunch or an immersive weekend adventure, our platform delivers entertainment that fits your lifestyle."}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 sm:mb-16">
              {features.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                  className={`group bg-gradient-to-br ${item.colors.from} ${item.colors.to} 
          rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 
          border-2 ${item.colors.border} ${item.colors.hoverBorder}`}
                >
                  <div className="flex flex-col gap-y-2 justify-center sm:flex-row md:flex-col lg:flex-row items-center sm:items-start md:items-center lg:items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-13 h-13 sm:w-16 sm:h-16 bg-gradient-to-br ${item.colors.iconBg} 
                rounded-2xl flex items-center justify-center shadow-lg 
                group-hover:scale-110 transition-transform duration-300`}
                      >
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {item.icon}
                        </svg>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3
                        className={`text-xl sm:text-[22px] md:text-2xl font-bold mb-2 sm:mb-1 xl:mb-2 text-center sm:text-left md:text-center lg:text-left ${item.colors.text} ${item.colors.hoverText} transition-colors`}
                      >
                        {item.title}
                      </h3>

                      <p className="text-gray-700 leading-relaxed text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why Choose Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">Why Choose Global Games?</h3>
              <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                <p className="text-lg md:text-xl leading-relaxed text-white/95 text-center">
                  In a crowded market of gaming websites, Global Games stands out through our unwavering commitment to quality over quantity. We understand that your time is valuable, which is why we eliminate the frustration of sorting through mediocre games. Every title in our collection has earned its place through genuine merit, engaging gameplay, and positive player feedback.
                </p>
                <p className="text-lg md:text-xl leading-relaxed text-white/95 text-center">
                  {"Our platform is designed with user experience at its core. The intuitive interface allows you to quickly find games that match your interests, whether you're into heart-pounding action sequences, brain-teasing puzzles, competitive racing, or creative adventures. Advanced search and filtering options help you discover hidden gems tailored to your preferences."}
                </p>
              </div>
            </div>

            {/* Game Categories Section */}
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 md:p-12 mb-12 sm:mb-16 border border-gray-100">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Game Categories We Cover
              </h3>
              <p className="text-lg md:text-xl text-gray-600 mb-10 text-center max-w-3xl mx-auto">
                Our diverse collection spans multiple genres to satisfy every type of gamer
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`bg-gradient-to-br ${cat.colors.from} ${cat.colors.to} 
      rounded-2xl p-6 border-2 ${cat.colors.border} ${cat.colors.hover} 
      transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex flex-col gap-y-2 justify-center xl:justify-start md:flex-col xl:flex-row items-center md:items-center xl:mb-4">
                      <div
                        className={`w-12 h-12 ${cat.colors.bg} rounded-xl flex items-center justify-center mr-4`}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {cat.icon}
                        </svg>
                      </div>

                      <h4 className={`text-xl font-bold mb-2 sm:mb-1 xl:mb-2 text-center sm:text-left md:text-center lg:text-left ${cat.colors.text}`}>
                        {cat.title}
                      </h4>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Quality Commitment Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900 text-center sm:text-left md:text-center lg:text-left">Our Commitment to Quality</h3>
                </div>
                <p className="text-base sm:text-lg text-center sm:text-left text-gray-700 leading-relaxed mb-4">
                  {"We carefully review every game before adding it to our platform.Our team checks gameplay, graphics, performance, and overall experience to ensure each title meets our standards. Only games that provide a smooth and enjoyable experience are featured for players."}
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-indigo-200">
                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold text-indigo-900 text-center sm:text-left md:text-center lg:text-left">Community First</h3>
                </div>
                <p className="text-base sm:text-lg text-center sm:text-left text-gray-700 leading-relaxed mb-4">
                  {"Your feedback helps shape our platform."}
                </p>
                <p className="text-base sm:text-lg text-center sm:text-left text-gray-700 leading-relaxed">
                  {"We listen to player suggestions, ratings, and comments to improve our game collection.Join a growing community of gamers who share tips, experiences, and recommendations."}
                </p>
              </div>
            </div>

            {/* Getting Started Tips */}
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 md:p-12 border border-gray-100">
              <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tips for Getting Started</h3>
                <p className="text-lg text-gray-600">{"New to our platform? Here's how to maximize your gaming experience"}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center md:items-start space-x-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 text-center md:text-left">Browse by Category</h4>
                    <p className="text-gray-700 text-center md:text-left">
                      Find games that match your mood and interests. Each category showcases our best titles in that genre.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center md:items-start space-x-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 text-center md:text-left">Read Game Details</h4>
                    <p className="text-gray-700 text-center md:text-left">
                       Explore the game descriptions, instructions, and key details before you start. A quick look can help you understand the gameplay better and enjoy it more.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center md:items-start space-x-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 text-center md:text-left">Explore New Genres</h4>
                    <p className="text-gray-700 text-center md:text-left">
                      Try games from different categories. You might discover a new favorite genre you never knew you enjoyed.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 justify-center md:justify-start md:flex-row items-center md:items-start space-x-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 text-center md:text-left">Check Back Regularly</h4>
                    <p className="text-gray-700 text-center md:text-left">
                      Visit regularly for new additions. We update our collection frequently with the latest and greatest online games.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 md:mt-12 text-center">
                <p className="text-base sm:text-lg md:text-xl xl:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-medium">
                  Discover why many players choose Global Games as their trusted place for enjoyable online gaming. Explore our carefully curated collection today and experience how quality selection can enhance your gameplay.
                </p>

              </div>
            </div>
          </div>
        </div>


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

      </PageTransition>
    </>
  );
}
