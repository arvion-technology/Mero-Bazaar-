-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MedicalServiceType" ADD VALUE 'CARDIOLOGY';
ALTER TYPE "MedicalServiceType" ADD VALUE 'PEDIATRICS';
ALTER TYPE "MedicalServiceType" ADD VALUE 'NEUROLOGY';
ALTER TYPE "MedicalServiceType" ADD VALUE 'ENT';

-- AlterTable
ALTER TABLE "MedicalAndDental" ADD COLUMN     "bufferMinutes" INTEGER,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "onlineAppointments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sameDayBooking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceOffered" TEXT,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "slotDurationMinutes" INTEGER;
