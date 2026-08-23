/*
  Warnings:

  - You are about to drop the column `disputeResolvedby` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "disputeResolvedby",
ADD COLUMN     "disputeResolvedBy" TEXT;
