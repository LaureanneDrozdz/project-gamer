
export async function apiFetch(path: string, options: RequestInit = {}) {
  const base =
    typeof window === 'undefined'
      ? process.env.SERVER_API_URL
      : process.env.NEXT_PUBLIC_API_URL;

  if (!base) throw new Error('API base URL is not defined');

  
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed (${res.status}): ${text}`);
  }
  return res.json();
}
