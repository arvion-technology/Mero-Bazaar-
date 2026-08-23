-- CreateEnum
CREATE TYPE "AgricultureListingType" AS ENUM ('PRODUCE', 'LIVESTOCK', 'TOOL', 'SEED', 'FERTILIZER', 'VET_SERVICE', 'FARM_LABOUR');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('KG', 'LITRE', 'PIECE', 'HEAD', 'BIGHA');

-- CreateEnum
CREATE TYPE "HealthVaccineStatus" AS ENUM ('VACCINATED', 'NOT_VACCINATED', 'UNKNOWN');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'AGRICULTURE';

-- CreateTable
CREATE TABLE "AgricultureAndLivestock" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingType" "AgricultureListingType" NOT NULL,
    "district" TEXT NOT NULL,
    "village" TEXT,
    "location" TEXT NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "unit" "UnitType" NOT NULL,
    "organicCertified" BOOLEAN NOT NULL DEFAULT false,
    "organicVerified" BOOLEAN NOT NULL DEFAULT false,
    "seasonalAvailability" TEXT,
    "animalType" TEXT,
    "breed" TEXT,
    "age" INTEGER,
    "healthVaccineStatus" "HealthVaccineStatus",
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgricultureAndLivestock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgricultureAndLivestock_listingId_key" ON "AgricultureAndLivestock"("listingId");

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_district_idx" ON "AgricultureAndLivestock"("district");

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_listingType_idx" ON "AgricultureAndLivestock"("listingType");

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_organicCertified_idx" ON "AgricultureAndLivestock"("organicCertified");

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_healthVaccineStatus_idx" ON "AgricultureAndLivestock"("healthVaccineStatus");

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_latitude_longitude_idx" ON "AgricultureAndLivestock"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "AgricultureAndLivestock" ADD CONSTRAINT "AgricultureAndLivestock_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
