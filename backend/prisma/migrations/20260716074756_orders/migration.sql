/*
  Warnings:

  - You are about to drop the column `paymentREf` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentREf",
ADD COLUMN     "paymentRef" TEXT;
