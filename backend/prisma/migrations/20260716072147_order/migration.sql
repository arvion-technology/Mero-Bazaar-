/*
  Warnings:

  - You are about to drop the column `status` on the `SecondHandGoods` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'RESERVATION');

-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'RESERVED';

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'EXPIRED';

-- DropIndex
DROP INDEX "SecondHandGoods_status_idx";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "paymentREf" TEXT,
ADD COLUMN     "reservedUntil" TIMESTAMP(3),
ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT 'DELIVERY',
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "deliveryDate" DROP NOT NULL,
ALTER COLUMN "deliveryAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SecondHandGoods" DROP COLUMN "status";

-- CreateIndex
CREATE INDEX "Order_type_idx" ON "Order"("type");
