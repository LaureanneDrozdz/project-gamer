const nextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "via.assets.so",
      "www.worldhistory.org",
      "example.com",
      "placehold.co",
      "rawg.io",
      "media.rawg.io"
    ],
    // Allow Next's image optimizer to fetch these remote hosts explicitly.
    // Some Next versions require `remotePatterns` for external fetches.
    remotePatterns: [
      { protocol: 'https', hostname: 'randomuser.me', pathname: '/**' },
      { protocol: 'https', hostname: 'via.assets.so', pathname: '/**' },
      { protocol: 'https', hostname: 'www.worldhistory.org', pathname: '/**' },
      { protocol: 'https', hostname: 'rawg.io', pathname: '/**' },
      { protocol: 'https', hostname: 'media.rawg.io', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' }
    ],
  },

  async rewrites() {
    const backendBase = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return [
      {
        source: '/api/rawg/:path*',
        destination: 'https://api.rawg.io/api/:path*',
      },
      {
        source: '/api/backend/:path*',
        destination: `${backendBase}/:path*`,
      },
    ];
  },
};

// Export as CommonJS so Node/builders that expect `next.config.js` can load it
// without ESM/TS parsing issues.
module.exports = nextConfig;
