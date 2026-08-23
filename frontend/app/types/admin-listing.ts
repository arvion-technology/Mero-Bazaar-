export type ListingCategory =
  | "VEHICLE" | "JOB" | "MEDICAL" | "TRADES" | "RENTAL"
  | "AGRICULTURE" | "SECONDHAND" | "FOODS" | "BEAUTY";

export type ListingStatus = "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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
  vehicle: Record<string, JsonValue> | null;
  job: Record<string, JsonValue> | null;
  medical: Record<string, JsonValue> | null;
  trades: Record<string, JsonValue> | null;
  rental: Record<string, JsonValue> | null;
  agriculture: Record<string, JsonValue> | null;
  secondhand: Record<string, JsonValue> | null;
  foods: Record<string, JsonValue> | null;
  beauty: Record<string, JsonValue> | null;
}