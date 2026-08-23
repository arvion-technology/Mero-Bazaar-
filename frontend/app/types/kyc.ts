export interface VendorKycDetail {
  id: string;
  fullName: string;
  dateOfBirth: string;
  panNumber: string | null;
  contactNumber: string;
  address: string;
  bankName: string;
  account: string;
  accountHolderName: string;
  panCardUrl: string | null;
  photoUrl: string | null;
  selfieWithPanUrl: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  submittedAt: string;
  rejectionReason: string | null;
}

export interface VendorKycRecord {
  id: string;
  fullName: string;
  contactNumber: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  submittedAt: string;
}

export type KYCStatus = "Pending" | "Verified" | "Rejected";

export interface KYCRow {
  id: string;
  name: string;
  initial: string;
  color: string;
  date: string;
  status: KYCStatus;
}

export interface MappedKycDetail {
  id: string;
  name: string;
  initial: string;
  color: string;
  date: string;
  status: KYCStatus;
  appliedOn: string;
  birthdate: string;
  panNumber: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  rejectionReason?: string;
  panCardUrl?: string;
  photoUrl?: string;
  selfieWithPanUrl?: string;
}