"use client";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkBase,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { gamesAPI } from "@/utils/api/games.api";

interface Game {
    id: string;
    title: string;
    description:string,
    url: string;
    thumb: string;
    category: string;
    tags: string;
    instructions?: string;
    Popularity?:string;
  }

// Create a custom BreadcrumbLink that uses Next.js Link
interface BreadcrumbLinkProps extends Omit<React.ComponentProps<typeof BreadcrumbLinkBase>, 'asChild'> {
  href: string;
  children: React.ReactNode;
}

const BreadcrumbLink = ({
  href,
  children,
  ...props
}: BreadcrumbLinkProps) => {
  const { className, ...restProps } = props;
  return (
    <BreadcrumbLinkBase asChild className={className}>
      <Link href={href} {...restProps}>
        {children}
      </Link>
    </BreadcrumbLinkBase>
  );
};

// Game Card Component (same as in home page)
const GameCard = ({ game }: { game: Game }) => (
  <Link href={`/${game.id}`}>
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 md:h-56 w-full">
        <Image
          src={game.thumb || "/placeholder-game.jpg"}
          alt={game.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg line-clamp-1">{game.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-200">{game.category}</span>
            
          </div>
        </div>
      </div>
    </div>
  </Link>
);

// Function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TopGames() {
  // Shuffle games once when component mounts (client-side)
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    async function loadGames() {
      const data = await gamesAPI.getGames();
      setGames(data?.data || []);
    }
    loadGames();
  }, []);
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50 py-8">
        {/* Breadcrumb */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Top Games</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900  mb-3 sm:mb-4">🎮 Top Games</h1>
          <p className="text-gray-600 max-w-3xl">
            Discover the most popular and trending games that everyone is playing right now.
          </p>
        </div>

        {/* Popularity Sections */}
        {[
          { type: 'bestgames', name: '🔥 Best Games', color: 'bg-yellow-500' },
          { type: 'hotgames', name: '🔥 Hot Games', color: 'bg-orange-500' },
          { type: 'mostplayed', name: '🎮 Most Played', color: 'bg-blue-500' },
          { type: 'newest', name: '🆕 Newest Games', color: 'bg-green-500' },
          { type: 'editorpicks', name: '⭐ Editor Picks', color: 'bg-purple-500' },
          { type: 'exclusivegames', name: '🎯 Exclusive Games', color: 'bg-pink-500' }
        ].map(({ type, name, color }) => {
          // Get all games of this type and shuffle them
          const allGamesOfType = games.filter(game => game.Popularity === type);
          const shuffledGamesOfType = shuffleArray([...allGamesOfType]);
          if (shuffledGamesOfType.length === 0) return null;

          return (
            <div key={type} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12 mt-8">
              <div className="w-full px-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-1 h-6 rounded-full ${color}`}></div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {name}
                    </h2>
                  </div>
                  <Link 
                    href={`/popular/${type}`} 
                    className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-1 rounded-full cursor-pointer text-sm md:text-base"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shuffledGamesOfType.slice(0, 4).map((game) => (
                  <GameCard key={`${type}-${game.id}-${Math.random().toString(36).substr(2, 9)}`} game={game} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Categories Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {shuffleArray(Array.from(new Set(games?.map(g => g.category)))).slice(0, 12).map((category) => (
              <Link 
                key={category} 
                href={`/category/${category.replace(/\s+/g, '-')}`}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}