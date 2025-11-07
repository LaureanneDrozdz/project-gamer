import { GamesResponse } from '@/types';

export async function fetchGames(): Promise<GamesResponse> {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(`/api/rawg/games?key=${apiKey}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }
  return res.json();
}
