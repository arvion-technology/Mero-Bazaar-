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
        source: "/api/:path((?!auth(?:/|$)|otp(?:/|$)|vendor-kyc(?:/|$)|user(?:/|$)).*)",
        destination: `${API_URL}/:path`,
      },
    ];
  },
};

export default nextConfig;