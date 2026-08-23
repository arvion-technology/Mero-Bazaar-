-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('ROOM', 'FLAT', 'APARTMENT', 'HOUSE', 'HOSTEL', 'LAND', 'SHUTTER', 'OFFICE');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('RENT', 'SALE');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('OWNER', 'AGENT');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'RENTAL';

-- CreateTable
CREATE TABLE "RentalAndRealEstate" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT,
    "ward" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "monthlyRent" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "squareFeet" INTEGER,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "parkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "wifiAvailable" BOOLEAN NOT NULL DEFAULT false,
    "waterIncluded" BOOLEAN NOT NULL DEFAULT false,
    "electricityIncluded" BOOLEAN NOT NULL DEFAULT false,
    "petFriendly" BOOLEAN NOT NULL DEFAULT false,
    "availableFrom" TIMESTAMP(3),
    "isOwnerOrAgent" "OwnerType" NOT NULL,
    "noBroker" BOOLEAN NOT NULL DEFAULT false,
    "nearbyLandmarks" TEXT[],
    "rules" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalAndRealEstate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RentalAndRealEstate_listingId_key" ON "RentalAndRealEstate"("listingId");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_city_idx" ON "RentalAndRealEstate"("city");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_propertyType_idx" ON "RentalAndRealEstate"("propertyType");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_listingType_idx" ON "RentalAndRealEstate"("listingType");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_furnished_idx" ON "RentalAndRealEstate"("furnished");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_isOwnerOrAgent_idx" ON "RentalAndRealEstate"("isOwnerOrAgent");

-- CreateIndex
CREATE INDEX "RentalAndRealEstate_latitude_longitude_idx" ON "RentalAndRealEstate"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "RentalAndRealEstate" ADD CONSTRAINT "RentalAndRealEstate_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
