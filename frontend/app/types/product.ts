export interface Seller {
  id?: string;
  name?: string;
  image?: string | null;
  phone?: string;
  email?: string;
  isVerified?: boolean;
}

export interface ProductDetail {
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
  [key: string]: any;
}

export interface RelatedItem {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  category?: string;
}