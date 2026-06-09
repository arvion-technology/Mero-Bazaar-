import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/category/electronics",
        destination: "/category/secondhand",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
