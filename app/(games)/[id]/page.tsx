import { gamesAPI } from "@/utils/api/games.api";
import GameDetail from "@/pages/GameDetail";

interface Game {
 id: string;
 title: string;
 description: string;
 url: string;
 thumb: string;
 category: string;
 tags: string;
 instructions?: string;
 difficulty?: string;
 gameControls?: Array<{
 key: string;
 action: string;
 }>;
}
// Define the API response type
interface GamesApiResponse {
 data: Game[];
}

interface GameWithSimilar {
 game: Game | null;
 similarGames: Game[];
}

async function getGameByIdAndSimilar(id: string): Promise<GameWithSimilar> {
 const res = await gamesAPI.getGames() as GamesApiResponse;
 const allGames = res?.data || [];

  // find the selected game
  const game = allGames.find((g: Game) => g.id === id) || null;


  // find similar games (same category, limit 5)
  let similarGames: Game[] = [];
  if (game) {
    similarGames = allGames
      .filter((g: Game) => g.category === game.category && g.id !== game.id)
      .slice(0, 5);
  }

  return { game, similarGames };

}

export default async function GamePage({ params }: { params: { id: string } }) {

  const { id } = await params;
  const { game, similarGames } = await getGameByIdAndSimilar(id);
  
   if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <>
      <GameDetail games={game} similarGames={similarGames} />
    </>
  );
}

