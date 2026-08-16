export interface BuySeller {
  id: string;
  name: string;
  avatar: string | null;
  phone: string;
  memberSince: string;      
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  totalListing: number;     }

export interface BuyReview {
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BuyProduct {
  id: string;
  title: string;
  thumb: string;
  images: string[];
  category: string;
  condition: "new" | "used";
  price: number;
  priceDisplay: string;
  location: string;
  timeAgo: string;
  postedDaysAgo: number;
  badge: string | null;
  badgeColor: string;
  extra?: string;
  description: string;
  detailedDescription?: string;
  seller: BuySeller;
  tags: string[];
  details: { label: string; value: string }[];
  negotiable: boolean;
  deliveryAvailable: boolean;
  warrantyAvailable: boolean;
  reviews: BuyReview[];
}

export interface BuyCard {
  id: string;
  title: string;
  thumb: string;
  price: number;
  priceDisplay: string;
  location: string;
  timeAgo: string;
  badge: string | null;
  badgeColor: string;
  extra?: string;
  category: string;
  condition: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
}