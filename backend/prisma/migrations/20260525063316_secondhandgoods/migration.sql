-- CreateEnum
CREATE TYPE "SecondHandCategory" AS ENUM ('FURNITURE', 'APPLIANCES', 'CLOTHING', 'BOOKS', 'BABY', 'SPORTS', 'INSTRUMENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "SecondHandCondition" AS ENUM ('LIKE_NEW', 'GOOD', 'FAIR', 'FOR_PARTS');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD', 'EXPIRED');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'SECONDHAND';

-- CreateTable
CREATE TABLE "SecondHandGoods" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "category" "SecondHandCategory" NOT NULL,
    "condition" "SecondHandCondition" NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT[],
    "city" TEXT NOT NULL,
    "description" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecondHandGoods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecondHandGoods_listingId_key" ON "SecondHandGoods"("listingId");

-- CreateIndex
CREATE INDEX "SecondHandGoods_category_idx" ON "SecondHandGoods"("category");

-- CreateIndex
CREATE INDEX "SecondHandGoods_condition_idx" ON "SecondHandGoods"("condition");

-- CreateIndex
CREATE INDEX "SecondHandGoods_city_idx" ON "SecondHandGoods"("city");

-- CreateIndex
CREATE INDEX "SecondHandGoods_price_idx" ON "SecondHandGoods"("price");

-- CreateIndex
CREATE INDEX "SecondHandGoods_status_idx" ON "SecondHandGoods"("status");

-- AddForeignKey
ALTER TABLE "SecondHandGoods" ADD CONSTRAINT "SecondHandGoods_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
