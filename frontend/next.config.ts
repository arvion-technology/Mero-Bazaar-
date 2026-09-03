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

  experimental: {
    cpus: 1,
  },

  async rewrites() {
    return [
      {
        source:
          "/api/:path((?!auth(?:/|$)|otp(?:/|$)|vendor-kyc(?:/|$)|user(?:/|$)).*)",
        destination: `${API_URL}/api/:path`,
      },
    ];
  },
};

export default nextConfig;