-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('CALL', 'CHAT', 'APPLY');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "leadType" "LeadType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
