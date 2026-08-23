-- CreateEnum
CREATE TYPE "VetServiceType" AS ENUM ('GENERAL_CHECKUP', 'VACCINATION', 'SURGERY', 'DEWORMING', 'BREEDING_CONSULTATION', 'EMERGENCY', 'OTHER');

-- AlterTable
ALTER TABLE "AgricultureAndLivestock" ADD COLUMN     "availabilityDays" "WeekDay"[],
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "healthCertificate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobileService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceRadiusKm" INTEGER,
ADD COLUMN     "vaccinationAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vetServiceType" "VetServiceType";

-- CreateIndex
CREATE INDEX "AgricultureAndLivestock_vetServiceType_idx" ON "AgricultureAndLivestock"("vetServiceType");
