"use client"
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkBase,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useEffect, useState } from 'react';
import { gamesAPI } from '@/utils/api/games.api';

// Create a custom BreadcrumbLink that uses Next.js Link
interface BreadcrumbLinkProps extends Omit<React.ComponentProps<typeof BreadcrumbLinkBase>, 'asChild'> {
  href: string;
  children: React.ReactNode;
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
  Popularity?:string
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

// Map URL-friendly names to display names and colors
const POPULARITY_TYPES: Record<string, { name: string; color: string }> = {
  bestgames: { name: '🔥 Best Games', color: 'bg-yellow-500' },
  hotgames: { name: '🔥 Hot Games', color: 'bg-orange-500' },
  mostplayed: { name: '🎮 Most Played', color: 'bg-blue-500' },
  newest: { name: '🆕 Newest Games', color: 'bg-green-500' },
  editorpicks: { name: '⭐ Editor Picks', color: 'bg-purple-500' },
  exclusivegames: { name: '🎯 Exclusive Games', color: 'bg-pink-500' }
};

export default function PopularGamesPage() {
 const params = useParams();
  const name = params?.name as string;
  
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        const data = await gamesAPI.getGames();
        setGames(data?.data || []);
      } catch (err) {
        console.error("Error loading games:", err);
        setError("Failed to load games");
      } finally {
        setLoading(false);
      }
    }
    
    loadGames();
  }, []);


  if (loading) {
    return 
  }

  if (error) {
    return <div className="container py-8 text-red-500">{error}</div>;
  }


  const popularityInfo = POPULARITY_TYPES[name];
  
  if (!popularityInfo) {
    notFound();
  }

  const popularGames = games.filter(game => game.Popularity === name);
  
  if (popularGames.length === 0) {
    notFound();
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
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
                  <BreadcrumbLink href="/top-games">Top Games</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{popularityInfo.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`w-2 h-10 ${popularityInfo.color} rounded-full`}></div>
            <h1 className="text-3xl font-bold text-gray-900">{popularityInfo.name}</h1>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularGames.map((game) => (
              <Link 
                key={game.id} 
                href={`/${game.id}?fromPopular=true&name=${game.Popularity}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="relative h-full w-full transform transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={game.thumb || "/placeholder-game.jpg"}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg line-clamp-1">{game.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-200">{game.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link 
              href="/top-games" 
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              ← Back to Top Games
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}

