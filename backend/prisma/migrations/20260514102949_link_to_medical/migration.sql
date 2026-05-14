/*
  Warnings:

  - A unique constraint covering the columns `[listingId]` on the table `MedicalAndDental` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingId` to the `MedicalAndDental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalAndDental" ADD COLUMN     "listingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalAndDental_listingId_key" ON "MedicalAndDental"("listingId");

-- AddForeignKey
ALTER TABLE "MedicalAndDental" ADD CONSTRAINT "MedicalAndDental_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
