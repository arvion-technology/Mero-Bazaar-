/*
  Warnings:

  - You are about to drop the column `created_at` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `nmcBadge` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `VerificationDocument` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `MedicalAndDental` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_doctorId_start_time_key";

-- DropIndex
DROP INDEX "MedicalAndDental_isVerified_idx";

-- DropIndex
DROP INDEX "MedicalAndDental_speciality_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "created_at",
DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isVerifiedDoctor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MedicalAndDental" DROP COLUMN "category",
DROP COLUMN "isVerified",
DROP COLUMN "nmcBadge",
DROP COLUMN "speciality",
ADD COLUMN     "specialty" TEXT NOT NULL,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "VerificationDocument" DROP COLUMN "fileUrl";

-- DropEnum
DROP TYPE "MedicalCategory";

-- CreateIndex
CREATE INDEX "MedicalAndDental_specialty_idx" ON "MedicalAndDental"("specialty");

-- CreateIndex
CREATE INDEX "MedicalAndDental_verificationStatus_idx" ON "MedicalAndDental"("verificationStatus");
