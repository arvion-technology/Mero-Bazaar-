/*
  Warnings:

  - You are about to drop the column `availableSlots` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MedicalServiceType" AS ENUM ('DENTAL', 'GENERAL_MEDICINE', 'GYNECOLOGY', 'ORTHOPEDIC', 'DERMATOLOGY', 'OTHER');

-- CreateEnum
CREATE TYPE "BeautyServiceType" AS ENUM ('SALON', 'BARBER', 'MAKEUP_ARTIST', 'SKINCARE', 'SPA', 'COSMETICS', 'BRIDAL');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'BEAUTY';

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_listingId_fkey";

-- DropIndex
DROP INDEX "MedicalAndDental_specialty_idx";

-- AlterTable
ALTER TABLE "MedicalAndDental" DROP COLUMN "availableSlots",
DROP COLUMN "specialty",
ADD COLUMN     "serviceType" "MedicalServiceType" NOT NULL DEFAULT 'GENERAL_MEDICINE';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "hairBeautyAndWellnessId" TEXT,
ADD COLUMN     "reviewerName" TEXT;

-- DropTable
DROP TABLE "Appointment";

-- CreateTable
CREATE TABLE "MedicalAppointment" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT,

    CONSTRAINT "MedicalAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalSlot" (
    "id" TEXT NOT NULL,
    "medicalId" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HairBeautyAndWellness" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "serviceType" "BeautyServiceType" NOT NULL,
    "price" INTEGER NOT NULL,
    "priceStartingFrom" BOOLEAN NOT NULL DEFAULT false,
    "homeVisit" BOOLEAN NOT NULL DEFAULT false,
    "portfolioUrls" TEXT[],
    "bridalAvailable" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HairBeautyAndWellness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeautyAppointment" (
    "id" TEXT NOT NULL,
    "beautyId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT,

    CONSTRAINT "BeautyAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeautySlot" (
    "id" TEXT NOT NULL,
    "beautyId" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeautySlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicalAppointment_status_idx" ON "MedicalAppointment"("status");

-- CreateIndex
CREATE INDEX "MedicalAppointment_doctorId_idx" ON "MedicalAppointment"("doctorId");

-- CreateIndex
CREATE INDEX "MedicalSlot_medicalId_idx" ON "MedicalSlot"("medicalId");

-- CreateIndex
CREATE INDEX "MedicalSlot_day_idx" ON "MedicalSlot"("day");

-- CreateIndex
CREATE UNIQUE INDEX "HairBeautyAndWellness_listingId_key" ON "HairBeautyAndWellness"("listingId");

-- CreateIndex
CREATE INDEX "HairBeautyAndWellness_serviceType_idx" ON "HairBeautyAndWellness"("serviceType");

-- CreateIndex
CREATE INDEX "HairBeautyAndWellness_homeVisit_idx" ON "HairBeautyAndWellness"("homeVisit");

-- CreateIndex
CREATE INDEX "HairBeautyAndWellness_bridalAvailable_idx" ON "HairBeautyAndWellness"("bridalAvailable");

-- CreateIndex
CREATE INDEX "BeautyAppointment_beautyId_idx" ON "BeautyAppointment"("beautyId");

-- CreateIndex
CREATE INDEX "BeautyAppointment_status_idx" ON "BeautyAppointment"("status");

-- CreateIndex
CREATE INDEX "BeautySlot_beautyId_idx" ON "BeautySlot"("beautyId");

-- CreateIndex
CREATE INDEX "BeautySlot_day_idx" ON "BeautySlot"("day");

-- CreateIndex
CREATE INDEX "Review_listingId_idx" ON "Review"("listingId");

-- AddForeignKey
ALTER TABLE "MedicalAppointment" ADD CONSTRAINT "MedicalAppointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "MedicalAndDental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalAppointment" ADD CONSTRAINT "MedicalAppointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MedicalSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalAppointment" ADD CONSTRAINT "MedicalAppointment_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalSlot" ADD CONSTRAINT "MedicalSlot_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalAndDental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_hairBeautyAndWellnessId_fkey" FOREIGN KEY ("hairBeautyAndWellnessId") REFERENCES "HairBeautyAndWellness"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HairBeautyAndWellness" ADD CONSTRAINT "HairBeautyAndWellness_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeautyAppointment" ADD CONSTRAINT "BeautyAppointment_beautyId_fkey" FOREIGN KEY ("beautyId") REFERENCES "HairBeautyAndWellness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeautyAppointment" ADD CONSTRAINT "BeautyAppointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "BeautySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeautyAppointment" ADD CONSTRAINT "BeautyAppointment_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeautySlot" ADD CONSTRAINT "BeautySlot_beautyId_fkey" FOREIGN KEY ("beautyId") REFERENCES "HairBeautyAndWellness"("id") ON DELETE CASCADE ON UPDATE CASCADE;
