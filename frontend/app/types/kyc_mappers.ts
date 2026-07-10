import type { VendorKycDetail, VendorKycRecord, KYCRow, MappedKycDetail, KYCStatus } from "./kyc";

export const AVATAR_COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#60a5fa"];

export function toTitleStatus(s: VendorKycRecord["status"]): KYCStatus {
  return s === "PENDING" ? "Pending" : s === "VERIFIED" ? "Verified" : "Rejected";
}

export function mapKycRow(k: VendorKycRecord, index: number): KYCRow {
  return {
    id: k.id,
    name: k.fullName,
    initial: (k.fullName?.[0] ?? "?").toUpperCase(),
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    date: new Date(k.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    status: toTitleStatus(k.status),
  };
}
export function mapKycDetail(k: VendorKycDetail): MappedKycDetail {
  return {
    id: k.id,
    name: k.fullName,
    initial: (k.fullName?.[0] ?? "?").toUpperCase(),
    color: "#818cf8",
    date: new Date(k.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    status: toTitleStatus(k.status),
    appliedOn: new Date(k.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    birthdate: new Date(k.dateOfBirth).toLocaleDateString("en-US", { dateStyle: "long" } as Intl.DateTimeFormatOptions),
    panNumber: k.panNumber ?? "-",
    phone: k.contactNumber,
    address: k.address,
    bankName: k.bankName,
    bankAccount: k.account,
    accountHolder: k.accountHolderName,
    rejectionReason: k.rejectionReason ?? undefined,
    panCardUrl: k.panCardUrl ?? undefined,
    photoUrl: k.photoUrl ?? undefined,
    selfieWithPanUrl: k.selfieWithPanUrl ?? undefined,
  };
}