-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('VEHICLE');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('bike', 'scooter', 'car', 'ev', 'truck', 'spare_parts');

-- CreateEnum
CREATE TYPE "VehicleCondition" AS ENUM ('new', 'used', 'refurb');

-- CreateEnum
CREATE TYPE "BluebookStatus" AS ENUM ('verified', 'pending', 'none');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "category" "ListingCategory" NOT NULL DEFAULT 'VEHICLE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "km_driven" INTEGER NOT NULL,
    "condition" "VehicleCondition" NOT NULL,
    "bluebook_status" "BluebookStatus" NOT NULL,
    "fuel_type" "FuelType",
    "ownership_transfer_ready" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_listingId_key" ON "Vehicle"("listingId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
