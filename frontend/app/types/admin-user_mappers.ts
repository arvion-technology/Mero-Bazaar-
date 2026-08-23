import type { AdminUserRecord, KycFilterStatus } from "./admin-user";

export interface BadgeInfo {
  bg: string;
  color: string;
  label: string;
}

const KYC_BADGE_MAP: Record<KycFilterStatus, BadgeInfo> = {
  VERIFIED: { bg: "#dcfce7", color: "#16a34a", label: "Verified" },
  PENDING: { bg: "#fef9c3", color: "#ca8a04", label: "Pending" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
  NOT_SUBMITTED: { bg: "#f1f5f9", color: "#64748b", label: "Not submitted" },
};

export function getKycBadge(user: AdminUserRecord): BadgeInfo {
  const status: KycFilterStatus = user.vendorKyc?.status ?? "NOT_SUBMITTED";
  return KYC_BADGE_MAP[status];
}

const STATUS_PILL_MAP: Record<string, Omit<BadgeInfo, "label">> = {
  VERIFIED: { bg: "#dcfce7", color: "#16a34a" },
  PENDING: { bg: "#fef9c3", color: "#ca8a04" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626" },
};

export function getStatusPill(status: string): Omit<BadgeInfo, "label"> {
  return STATUS_PILL_MAP[status] || { bg: "#f1f5f9", color: "#64748b" };
}