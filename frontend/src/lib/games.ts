export async function fetchGames() {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }
  return res.json();
}
