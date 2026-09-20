-- CreateEnum
CREATE TYPE "FeaturedSlot" AS ENUM ('HOME_FEATURED', 'CATEGORY_TOP', 'SEARCH_TOP');

-- CreateEnum
CREATE TYPE "FeaturedTier" AS ENUM ('PLATINUM', 'GOLD', 'STANDARD');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'REFUNDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "FeaturedPlacement" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "category" "ListingCategory" NOT NULL,
    "slot" "FeaturedSlot" NOT NULL DEFAULT 'HOME_FEATURED',
    "tier" "FeaturedTier" NOT NULL DEFAULT 'STANDARD',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "amountPaid" INTEGER,
    "paymentRef" TEXT,
    "paymentMethod" "PaymentMethod",
    "status" "PlacementStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "createdBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedPlacement_paymentRef_key" ON "FeaturedPlacement"("paymentRef");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_slot_status_startsAt_endsAt_idx" ON "FeaturedPlacement"("slot", "status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_listingId_idx" ON "FeaturedPlacement"("listingId");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_sellerId_idx" ON "FeaturedPlacement"("sellerId");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_category_idx" ON "FeaturedPlacement"("category");

-- CreateIndex
CREATE INDEX "FeaturedPlacement_endsAt_idx" ON "FeaturedPlacement"("endsAt");

-- AddForeignKey
ALTER TABLE "FeaturedPlacement" ADD CONSTRAINT "FeaturedPlacement_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedPlacement" ADD CONSTRAINT "FeaturedPlacement_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
