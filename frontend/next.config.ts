const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth(?:/|$)).*)",
        destination: `${API_URL}/api/:path`,
      },
    ];
  },
};

export default nextConfig;