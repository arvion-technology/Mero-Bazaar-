/*
  Warnings:

  - You are about to drop the `vendorKyc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vendorKyc" DROP CONSTRAINT "vendorKyc_userId_fkey";

-- DropTable
DROP TABLE "vendorKyc";

-- CreateTable
CREATE TABLE "VendorKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "panNumber" TEXT,
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

    CONSTRAINT "VendorKyc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorKyc_userId_key" ON "VendorKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorKyc_contactNumber_key" ON "VendorKyc"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VendorKyc_panNumber_key" ON "VendorKyc"("panNumber");

-- CreateIndex
CREATE INDEX "VendorKyc_status_idx" ON "VendorKyc"("status");

-- CreateIndex
CREATE INDEX "VendorKyc_contactNumber_idx" ON "VendorKyc"("contactNumber");

-- CreateIndex
CREATE INDEX "VendorKyc_panNumber_idx" ON "VendorKyc"("panNumber");

-- CreateIndex
CREATE INDEX "VendorKyc_account_idx" ON "VendorKyc"("account");

-- AddForeignKey
ALTER TABLE "VendorKyc" ADD CONSTRAINT "VendorKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
