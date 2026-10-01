import type { MetadataRoute } from "next";

const CATEGORIES = [
  "vehicles",
  "job",
  "medical",
  "trade-and-homerepair",
  "rent-and-real-estate",
  "agriculture-and-livestock",
  "secondhand",
  "food",
  "beauty",
];

const STATIC_ROUTES = [
  "",
  "/buy",
  "/categories",
  "/services",
  "/contact",
  "/privacy",
  "/terms",
  "/refund",
  "/safety",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002").replace(
    /\/$/,
    "",
  );

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${base}/category/${slug}`,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticEntries, ...categoryEntries];
}
