import type { ListingStatus } from "./admin-listing";

interface BadgeInfo {
  bg: string;
  color: string;
  label: string;
}

const STATUS_BADGE_MAP: Record<ListingStatus, BadgeInfo> = {
  ACTIVE: { bg: "#dcfce7", color: "#16a34a", label: "Active" },
  RESERVED: { bg: "#fef9c3", color: "#ca8a04", label: "Reserved" },
  SOLD: { bg: "#e0e7ff", color: "#4f46e5", label: "Sold" },
  EXPIRED: { bg: "#fee2e2", color: "#dc2626", label: "Expired" },
};

export function getListingStatusBadge(status: ListingStatus): BadgeInfo {
  return STATUS_BADGE_MAP[status] || { bg: "#f1f5f9", color: "#64748b", label: status };
}

export function formatCategory(category: string): string {
  return category.charAt(0) + category.slice(1).toLowerCase();
}