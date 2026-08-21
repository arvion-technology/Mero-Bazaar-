/* ─────────── WISHLIST ADAPTER ─────────── */

import type { RawListing, RelatedItem } from "@/app/types/wishlist";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/* ── Helpers ── */
function prefixImage(path: string | undefined | null): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function formatPrice(price: number | undefined, currency?: string): string {
  if (price == null) return "Price on call";
  return `${currency ?? "NPR"} ${price.toLocaleString("en-IN")}`;
}

/* ── Related Card Adapter ── */
export function toRelatedCard(raw: RawListing): RelatedItem {
  let images: string[];
  if (raw.images && raw.images.length > 0) {
    images = raw.images.map(prefixImage);
  } else if (raw.image) {
    images = [prefixImage(raw.image)];
  } else {
    images = ["/placeholder.png"];
  }

  const location =
    raw.location ??
    (raw.area && raw.city ? `${raw.area}, ${raw.city}` : raw.city ?? "");

  const seller = raw.seller ?? raw.user ?? raw.owner ?? {};
  const rating = typeof seller.rating === "number" ? seller.rating : 0;

  return {
    id: raw.id ?? "",
    title: raw.title ?? "Untitled",
    price: formatPrice(raw.price, raw.currency),
    priceDisplay: formatPrice(raw.price, raw.currency),
    location,
    image: images[0],
    thumb: images[0],
    category: raw.category,
    seller: { rating },
  };
}

/* ── Category Detection ── */
const CATEGORY_ROUTE_MAP: Record<string, string> = {
  vehicles: "vehicles", vehicle: "vehicles", car: "vehicles", bike: "vehicles",
  motorcycle: "vehicles", scooter: "vehicles", bicycle: "vehicles", van: "vehicles",
  truck: "vehicles", bus: "vehicles",

  job: "job", jobs: "job", career: "job", employment: "job", hiring: "job",
  labour: "job", labor: "job", work: "job",

  medical: "medical", dental: "medical", doctor: "medical", health: "medical",
  clinic: "medical", hospital: "medical", pharmacy: "medical", medicine: "medical",

  "trade-and-homerepair": "trade-and-homerepair", trade: "trade-and-homerepair",
  homerepair: "trade-and-homerepair", "home repair": "trade-and-homerepair",
  repair: "trade-and-homerepair", plumber: "trade-and-homerepair",
  electrician: "trade-and-homerepair", carpenter: "trade-and-homerepair",
  "ac repair": "trade-and-homerepair", painter: "trade-and-homerepair",
  builder: "trade-and-homerepair", construction: "trade-and-homerepair",
  maintenance: "trade-and-homerepair",

  "rent-and-real-estate": "rent-and-real-estate", property: "rent-and-real-estate",
  rent: "rent-and-real-estate", "real estate": "rent-and-real-estate",
  "real-estate": "rent-and-real-estate", house: "rent-and-real-estate",
  apartment: "rent-and-real-estate", flat: "rent-and-real-estate",
  land: "rent-and-real-estate", room: "rent-and-real-estate",
  hostel: "rent-and-real-estate", shutter: "rent-and-real-estate",
  office: "rent-and-real-estate",

  "agriculture-and-livestock": "agriculture-and-livestock",
  agriculture: "agriculture-and-livestock", livestock: "agriculture-and-livestock",
  farm: "agriculture-and-livestock", farming: "agriculture-and-livestock",
  crop: "agriculture-and-livestock", dairy: "agriculture-and-livestock",
  animal: "agriculture-and-livestock", poultry: "agriculture-and-livestock",
  agri: "agriculture-and-livestock",

  secondhand: "secondhand", "secondhand-goods": "secondhand", used: "secondhand",
  old: "secondhand", "pre-owned": "secondhand", "pre owned": "secondhand",
  thrift: "secondhand", resale: "secondhand",

  food: "food", delivery: "food", restaurant: "food", kitchen: "food",
  catering: "food", grocery: "food", tiffin: "food", meal: "food",

  beauty: "beauty", salon: "beauty", spa: "beauty", nail: "beauty",
  hair: "beauty", makeup: "beauty", wellness: "beauty", cosmetic: "beauty",
};

export function detectCategoryRoute(category?: string): string | null {
  if (!category) return null;
  const cat = category.toLowerCase();
  for (const [key, route] of Object.entries(CATEGORY_ROUTE_MAP)) {
    if (cat.includes(key)) return route;
  }
  return null;
}

export function getCategoryLabel(route: string | null): string {
  if (!route) return "Products";
  const labels: Record<string, string> = {
    vehicles: "Vehicles",
    job: "Jobs & Labour Hire",
    medical: "Medical & Dental",
    "trade-and-homerepair": "Trades & Home Repair",
    "rent-and-real-estate": "Rent & Real Estate",
    "agriculture-and-livestock": "Agriculture & Livestock",
    secondhand: "Secondhand Goods",
    food: "Food & Home Delivery",
    beauty: "Hair, Beauty & Wellness",
  };
  return labels[route] ?? "Products";
}

export function timeAgo(days?: number | null): string {
  if (days == null) return "";
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}