"use client";
import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { gamesAPI } from "@/utils/api/games.api";
import { Home } from "lucide-react";
interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
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
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = use(params);
      const [games, setGames] = useState<Game[]>([]);
  
  useEffect(() => {
    async function loadGames() {
      const data = await gamesAPI.getGames();
      setGames(data?.data||[]);
    }
    loadGames();
  }, []);

  const categoryName = decodeURIComponent(resolvedParams.category);
  const categoryGames = games.filter((game) => game.category === categoryName);

  useEffect(() => {
    document.body.style.overflow = 'auto';    
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br pt-4 mb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500">
                  {categoryName} Games
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-2xl font-bold text-black mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8">
          {categoryName} Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {categoryGames.map((game,index) => (
            <Link
              key={index}
              href={{
                pathname: `/${game.id}`,
                query: {
                  url: encodeURIComponent(game.url),
                  image: encodeURIComponent(game.thumb),
                  title: encodeURIComponent(game.title),
                  instructions: encodeURIComponent(game.instructions ?? ''),
                  fromCategory: resolvedParams.category ?? '',
                  tags: encodeURIComponent(game.tags),
                },
              }}
              className="block text-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative">
                <Image
                  unoptimized
                  src={game.thumb}
                  alt={game.title}
                  width={500}
                  height={500}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="text-base font-semibold text-black text-center line-clamp-2">
                  {game.title}
                </h3>
                <button className="mt-2 sm:mt-3 w-full bg-blue-400 hover:bg-blue-700 cursor-pointer text-white py-2 px-2 text-xs sm:text-sm rounded-md transition-colors duration-200">
                  Play Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
