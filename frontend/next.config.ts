import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${API_URL}/api/:path*`,
    },
  ],
};

export default nextConfig;