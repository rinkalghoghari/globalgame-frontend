import Game from "@/pages/Game";
import { gamesAPI } from "@/utils/api/games.api";

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

async function getGame(): Promise<Game[]> {
  const res = await gamesAPI.getGames();
  return res?.data || [];
}

export default async function GamePage() {
  const  games  = await getGame();
  if (!games?.length) {
    return <div>Game not found</div>;
  }

  return (
    <>
      <Game games={games} />
    </>
  )
}
