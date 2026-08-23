import type { BaseListing } from "./base";

export type SecondHandCategory =
  | "FURNITURE"
  | "APPLIANCES"
  | "CLOTHING"
  | "BOOKS"
  | "BABY"
  | "SPORTS"
  | "INSTRUMENTS"
  | "OTHER";

export const SECONDHAND_CONDITIONS = ["LIKE_NEW", "GOOD", "FAIR", "FOR_PARTS"] as const;
export type SecondhandCondition = (typeof SECONDHAND_CONDITIONS)[number];

export const CONDITION_LABEL: Record<SecondhandCondition, string> = {
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  FOR_PARTS: "For Parts",
};

export interface SecondhandListing extends BaseListing {
  userId: string;
  category: "SECONDHAND";

  secondhand: {
    category: SecondHandCategory;
    condition: SecondhandCondition;
    price: number;
    isNegotiable: boolean;
    city: string;
    description: string | null;
  } | null;

  user?: {
    name?: string | null;
    phone?: string | null;
    image?: string | null;
    createdAt?: string;
    isVerified?: boolean;
    _count?: { listings: number };
  };

  reviews?: {
    rating: number;
    comment?: string | null;
    reviewerName?: string | null;
    createdAt?: string;
  }[];
}

export interface SecondhandCard {
  id: string;
  title: string;
  price: string;
  location: string;
  condition: string;
  thumb: string;
  category: string;
  postedDaysAgo: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}