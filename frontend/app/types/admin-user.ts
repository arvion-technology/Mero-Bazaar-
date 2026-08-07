export type UserRole = "USER" | "VENDOR" | "DOCTOR" | "ADMIN";
export type KycVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type KycFilterStatus = KycVerificationStatus | "NOT_SUBMITTED";

export interface VendorKycSummary {
  status: KycVerificationStatus;
  submittedAt: string;
}

export interface VendorKycFull {
  id: string;
  status: KycVerificationStatus;
  contactNumber: string;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface VendorProfile {
  businessName: string;
  businessType: string;
  isVerified: boolean;
  rating: number;
  isOnProbation: boolean;
}

export interface DoctorProfile {
  doctorName: string;
  nmcLicenseNumber: string;
  specialization: string;
  verificationStatus: KycVerificationStatus;
  clinicName: string | null;
}

export interface AdminUserRecord {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  vendorKyc: VendorKycSummary | null;
}

export interface AdminUserDetail {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  vendorProfile: VendorProfile | null;
  doctorProfile: DoctorProfile | null;
  vendorKyc: VendorKycFull | null;
}