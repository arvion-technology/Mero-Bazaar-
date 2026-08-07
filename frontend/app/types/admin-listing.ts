export type ListingCategory =
  | "VEHICLE" | "JOB" | "MEDICAL" | "TRADES" | "RENTAL"
  | "AGRICULTURE" | "SECONDHAND" | "FOODS" | "BEAUTY";

export type ListingStatus = "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";

export interface AdminListingRecord {
  id: string;
  title: string;
  price: number | null;
  category: ListingCategory;
  status: ListingStatus;
  images: string[];
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

export interface AdminListingDetail {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: ListingCategory;
  status: ListingStatus;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
  vehicle: Record<string, any> | null;
  job: Record<string, any> | null;
  medical: Record<string, any> | null;
  trades: Record<string, any> | null;
  rental: Record<string, any> | null;
  agriculture: Record<string, any> | null;
  secondhand: Record<string, any> | null;
  foods: Record<string, any> | null;
  beauty: Record<string, any> | null;
}