/*
  Warnings:

  - You are about to drop the column `verification_doc_url` on the `MedicalAndDental` table. All the data in the column will be lost.
  - You are about to drop the column `verification_status` on the `MedicalAndDental` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,start_time]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_listingId_idx";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalAndDental" DROP COLUMN "verification_doc_url",
DROP COLUMN "verification_status";

-- CreateTable
CREATE TABLE "VerificationDocument" (
    "id" TEXT NOT NULL,
    "medicalId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerificationDocument_medicalId_idx" ON "VerificationDocument"("medicalId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_start_time_key" ON "Appointment"("doctorId", "start_time");

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalAndDental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
