/*
  Warnings:

  - You are about to drop the column `deliveryRadiusKm` on the `FoodsAndHomeDelivery` table. All the data in the column will be lost.
  - You are about to drop the column `hygieneRating` on the `FoodsAndHomeDelivery` table. All the data in the column will be lost.
  - You are about to drop the column `minOrderAmount` on the `FoodsAndHomeDelivery` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionAvailable` on the `FoodsAndHomeDelivery` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FoodsAndHomeDelivery_deliveryRadiusKm_idx";

-- AlterTable
ALTER TABLE "FoodsAndHomeDelivery" DROP COLUMN "deliveryRadiusKm",
DROP COLUMN "hygieneRating",
DROP COLUMN "minOrderAmount",
DROP COLUMN "subscriptionAvailable";
