export interface CreateFoodsPayload {
  title: string;
  description: string;
  foodType: FoodType;
  price: number;
  priceUnit: PriceUnit;
  deliveryDays: WeekDay[];
}

export interface FoodsListing {
  id: string;
  userId: string;
  title: string;
  category: "FOODS";
  description?: string | null;
  price?: number | null;
  createdAt: string;
  images: string[];
  status?: "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  sellerRating?: number;
  sellerReviewCount?: number;
  sellerTotalListing?: number;

  foods: {
    foodType: FoodType;
    price: number;
    priceUnit: PriceUnit;
    deliveryDays: WeekDay[];
  };

  user?: {
    name?: string | null;
    phone?: string | null;
    image?: string | null;
    createdAt?: string;
    isVerified?: boolean;
  };

  reviews?: {
    rating: number;
    comment?: string | null;
    reviewerName?: string | null;
    createdAt?: string;
  }[];
}

export interface FoodsCard {
  id: string;
  title: string;
  price: string;
  thumb: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  foodType: string;
  priceUnit: string;
}