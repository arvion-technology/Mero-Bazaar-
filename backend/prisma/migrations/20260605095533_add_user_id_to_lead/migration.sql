-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'VIEWED', 'SHORTLISTED', 'INTERVIEWED', 'REJECTED', 'HIRED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");
