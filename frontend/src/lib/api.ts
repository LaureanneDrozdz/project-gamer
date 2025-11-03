
export async function apiFetch(path: string, options: RequestInit = {}) {
  const base =
    typeof window === 'undefined'
      ? process.env.SERVER_API_URL
      : process.env.NEXT_PUBLIC_API_URL;

  if (!base) throw new Error('API base URL is not defined');

  
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (err: any) {
    // Re-throw with extra context to make local debugging easier (include base URL and optional code)
    const code = err?.code ? ` (code: ${err.code})` : '';
    throw new Error(`Fetch failed to ${base}${path} — ${err?.message || String(err)}${code}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed (${res.status}): ${text}`);
  }
  return res.json();
}
