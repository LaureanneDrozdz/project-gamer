import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
