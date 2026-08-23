/*
  Warnings:

  - You are about to drop the column `dipsuteStatus` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('NONE', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');

-- DropIndex
DROP INDEX "Order_dipsuteStatus_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dipsuteStatus",
ADD COLUMN     "disputeStatus" "DisputeStatus" NOT NULL DEFAULT 'NONE';

-- DropEnum
DROP TYPE "DipsuteStatus";

-- CreateIndex
CREATE INDEX "Order_disputeStatus_idx" ON "Order"("disputeStatus");
