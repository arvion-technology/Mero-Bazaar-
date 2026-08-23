export type ListingStatus = "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";

export interface BaseListing {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string | Date;
  status?: ListingStatus;
  isVerified?: boolean;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
}