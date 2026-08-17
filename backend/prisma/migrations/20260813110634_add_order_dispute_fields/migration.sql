-- CreateEnum
CREATE TYPE "DipsuteStatus" AS ENUM ('NONE', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "dipsuteStatus" "DipsuteStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "disputeReason" TEXT,
ADD COLUMN     "disputeResolvedAt" TIMESTAMP(3),
ADD COLUMN     "disputeResolvedby" TEXT;

-- CreateIndex
CREATE INDEX "Order_dipsuteStatus_idx" ON "Order"("dipsuteStatus");
