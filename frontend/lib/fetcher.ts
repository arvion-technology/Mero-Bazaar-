import { adaptListing } from "./adapter";
import type { DBListing, ListingDetail, RelatedListing } from "../app/types/listing";

// Fetch single listing
export async function fetchListing(id: string): Promise<ListingDetail | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("[fetchListing] HTTP error:", res.status);
      return null;
    }

    const db = (await res.json()) as DBListing;

    if (!db) {
      console.error("[fetchListing] empty db response");
      return null;
    }

    return adaptListing(db);
  } catch (err) {
    console.error("[fetchListing] failed:", err);
    return null;
  }
}

// Fetch related listings
export async function fetchRelatedListings(
  category: string | null | undefined,
  excludeId: string
): Promise<RelatedListing[]> {
  try {
    if (!category){console.warn("[fetchRelatedListings] missing category");
    return [];
    };

    const safeCategory = category.toUpperCase();
    const query = new URLSearchParams({ category: safeCategory, exclude: excludeId, limit: "8"});
    const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listings?${query.toString()}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("[fetchRelatedListings] HTTP error:", res.status);
      return [];
    }

    const data = (await res.json()) as Array<{
      id: string;
      title: string;
      price: number | null;
      location?: string;
      images: string[];
      vehicle?: { bluebook_status: string };
    }>;

    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      price:
        item.price != null
          ? `Rs. ${item.price.toLocaleString("en-IN")}`
          : "Price on request",
      location: item.location ?? "Nepal",
      image: item.images?.[0]
        ? `${IMG_BASE}${item.images[0]}`
        : "/placeholder.png",      verified: item.vehicle?.bluebook_status === "verified",
        }));
  } catch (err) {
    console.error("[fetchRelatedListings] failed:", err);
    return [];
  }
}