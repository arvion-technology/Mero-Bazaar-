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

  productionBrowserSourceMaps: false,

  experimental: {
    cpus: 1,
  },

  async rewrites() {
    return [
      {
        source:
          "/api/:path((?!auth(?:/|$)|otp(?:/|$)|vendor-kyc(?:/|$)|user(?:/|$)|jobs/[^/]+/apply(?:$)|jobs/[^/]+/has-applied(?:$)|leads(?:/|$)).*)",
        destination: `${API_URL}/api/:path`,
      },
    ];
  },

  // Defense-in-depth security headers for every HTML document the app serves.
  // The CSP is intentionally scoped to the low-risk, high-value directives so it
  // cannot break the map tiles, OAuth popups, or payment-gateway form posts the
  // marketplace relies on.
  async headers() {
    const productionHeaders = process.env.NODE_ENV === "production"
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ]
      : [];

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
          },
          ...productionHeaders,
        ],
      },
    ];
  },
};

export default nextConfig;