-- CreateEnum
CREATE TYPE "OtpContext" AS ENUM ('USER_REGISTRATION', 'KYC_CONTACT', 'PASSWORD_RESET', 'LOGIN');

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "isOnProbation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "probationEndsAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "vendorKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "panCardUrl" TEXT,
    "photoUrl" TEXT,
    "selfieWithPanUrl" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" TIMESTAMP(3),
    "bankName" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendorKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "context" "OtpContext" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendorKyc_userId_key" ON "vendorKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vendorKyc_contactNumber_key" ON "vendorKyc"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vendorKyc_panNumber_key" ON "vendorKyc"("panNumber");

-- CreateIndex
CREATE INDEX "vendorKyc_status_idx" ON "vendorKyc"("status");

-- CreateIndex
CREATE INDEX "vendorKyc_contactNumber_idx" ON "vendorKyc"("contactNumber");

-- CreateIndex
CREATE INDEX "vendorKyc_panNumber_idx" ON "vendorKyc"("panNumber");

-- CreateIndex
CREATE INDEX "vendorKyc_account_idx" ON "vendorKyc"("account");

-- CreateIndex
CREATE INDEX "PhoneOtp_phone_idx" ON "PhoneOtp"("phone");

-- CreateIndex
CREATE INDEX "PhoneOtp_context_idx" ON "PhoneOtp"("context");

-- AddForeignKey
ALTER TABLE "vendorKyc" ADD CONSTRAINT "vendorKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
