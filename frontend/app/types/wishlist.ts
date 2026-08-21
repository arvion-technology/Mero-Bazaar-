/* ─────────── WISHLIST DETAIL TYPES ─────────── */

export interface Seller {
  id?: string;
  name?: string;
  image?: string | null;
  avatar?: string | null;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  isPro?: boolean;
  isTrusted?: boolean;
  rating?: number;
  responseRate?: string;
  avgResponseTime?: string;
  memberSince?: string;
  totalListings?: number;
  bio?: string;
}

export interface Review {
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DetailItem {
  label: string;
  value: string;
}

/* Dynamic product — matches your original ProductDetail with [key: string]: any */
export interface WishlistProduct {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  category?: string;
  condition?: string;
  location?: string;
  city?: string;
  area?: string;
  postedDaysAgo?: number;
  negotiable?: boolean;
  isFavorited?: boolean;
  seller?: Seller;
  specs?: Record<string, string | number | boolean>;
  features?: string[];
  tags?: string[];
  deliveryAvailable?: boolean;
  warrantyAvailable?: boolean;
  reviews?: Review[];
  /* Allow any other field the API sends: brand, model, year, fuelType, etc. */
  [key: string]: any;
}

export interface RelatedItem {
  id: string;
  title: string;
  price: string;
  priceDisplay: string;
  location: string;
  image: string;
  thumb: string;
  category?: string;
  seller: {
    rating?: number;
  };
}

export interface RawListing {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  image?: string;
  category?: string;
  condition?: string;
  location?: string;
  city?: string;
  area?: string;
  postedDaysAgo?: number;
  postedAt?: string;
  negotiable?: boolean;
  isFavorited?: boolean;
  seller?: any;
  user?: any;
  owner?: any;
  specs?: Record<string, string | number | boolean>;
  features?: string[];
  tags?: string[];
  deliveryAvailable?: boolean;
  warrantyAvailable?: boolean;
  reviews?: Review[];
  [key: string]: any;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}