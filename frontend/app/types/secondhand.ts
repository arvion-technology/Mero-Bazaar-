export type SecondHandCategory =
  | "FURNITURE"
  | "APPLIANCES"
  | "CLOTHING"
  | "BOOKS"
  | "BABY"
  | "SPORTS"
  | "INSTRUMENTS"
  | "OTHER";

export type SecondHandCondition = "LIKE_NEW" | "GOOD" | "FAIR" | "FOR_PARTS";

export type SecondHandListing = {
  id: string;
  title: string;
  price: number | null;
  description: string | null;
  images: string[];
  createdAt: string;
  user: {
    name: string | null;
    phone: string | null;
  };
  secondhand: {
    category: SecondHandCategory;
    condition: SecondHandCondition;
    itemName: string;
    price: number;
    isNegotiable: boolean;
    photos: string[];
    city: string;
    description: string | null;
    expiresAt: string;
  };
};