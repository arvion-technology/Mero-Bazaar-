/*
  Warnings:

  - Added the required column `listingId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `MedicalAndDental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "listingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalAndDental" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "nmcBadge" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Appointment_listingId_idx" ON "Appointment"("listingId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "MedicalAndDental_city_idx" ON "MedicalAndDental"("city");

-- CreateIndex
CREATE INDEX "MedicalAndDental_speciality_idx" ON "MedicalAndDental"("speciality");

-- CreateIndex
CREATE INDEX "MedicalAndDental_homeVisitAvailable_idx" ON "MedicalAndDental"("homeVisitAvailable");

-- CreateIndex
CREATE INDEX "MedicalAndDental_isVerified_idx" ON "MedicalAndDental"("isVerified");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
