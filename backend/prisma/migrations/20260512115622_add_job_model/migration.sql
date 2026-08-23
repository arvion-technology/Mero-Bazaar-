-- CreateEnum
CREATE TYPE "PayPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('FULL_TIME', 'PART_TIME', 'GIG', 'LABOUR', 'DOMESTIC');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'JOB';

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "payPeriod" "PayPeriod" NOT NULL,
    "city" TEXT NOT NULL,
    "skillTags" TEXT[],
    "contractType" "ContractType" NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "employerPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_listingId_key" ON "Job"("listingId");

-- CreateIndex
CREATE INDEX "Job_city_idx" ON "Job"("city");

-- CreateIndex
CREATE INDEX "Job_isUrgent_idx" ON "Job"("isUrgent");

-- CreateIndex
CREATE INDEX "Job_contractType_idx" ON "Job"("contractType");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
