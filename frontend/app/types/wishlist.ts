export interface WishlistSeller {
  id: string;
  name: string;
  image: string | null;
  avatar?: string | null;
  phone: string;
  email: string;
  isVerified: boolean;
  isPro?: boolean;
  isTrusted?: boolean;
  rating: number;
  reviewCount: number;
  memberSince: string;
  totalListings: number;
  responseRate?: string;
  avgResponseTime?: string;
}

export interface WishlistReview {
  id?: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface WishlistProduct {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  images: string[];
  category?: string;
  condition?: string;
  location?: string;
  city?: string;
  area?: string;
  postedDaysAgo?: number;
  negotiable?: boolean;
  isFavorited?: boolean;
  seller?: WishlistSeller;
  sellerId?: string;
  specs?: Record<string, any>;
  features?: string[];
  tags?: string[];
  details?: { label: string; value: string }[];
  reviews?: WishlistReview[];
  [key: string]: any;
}

export interface WishlistCard {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  category?: string;
  condition?: string;
}