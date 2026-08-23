-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'TRADES';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "contactedAt" TIMESTAMP(3),
ADD COLUMN     "respondedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TradesAndHomeRepair" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ward" TEXT,
    "skillTags" TEXT[],
    "serviceAreaKm" INTEGER NOT NULL,
    "calloutCharge" INTEGER NOT NULL,
    "warrantyGiven" BOOLEAN NOT NULL DEFAULT false,
    "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "avgResponseHours" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradesAndHomeRepair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradesAndHomeRepair_listingId_key" ON "TradesAndHomeRepair"("listingId");

-- CreateIndex
CREATE INDEX "TradesAndHomeRepair_city_idx" ON "TradesAndHomeRepair"("city");

-- CreateIndex
CREATE INDEX "TradesAndHomeRepair_emergencyAvailable_idx" ON "TradesAndHomeRepair"("emergencyAvailable");

-- CreateIndex
CREATE INDEX "TradesAndHomeRepair_serviceAreaKm_idx" ON "TradesAndHomeRepair"("serviceAreaKm");

-- CreateIndex
CREATE INDEX "Listing_category_idx" ON "Listing"("category");

-- CreateIndex
CREATE INDEX "Listing_latitude_longitude_idx" ON "Listing"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "TradesAndHomeRepair" ADD CONSTRAINT "TradesAndHomeRepair_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
