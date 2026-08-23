-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationCategory" ADD VALUE 'LISTINGS';
ALTER TYPE "NotificationCategory" ADD VALUE 'PAYMENTS';
ALTER TYPE "NotificationCategory" ADD VALUE 'DISPUTES';
ALTER TYPE "NotificationCategory" ADD VALUE 'LEADS';
ALTER TYPE "NotificationCategory" ADD VALUE 'REVIEWS';
ALTER TYPE "NotificationCategory" ADD VALUE 'KYC';
ALTER TYPE "NotificationCategory" ADD VALUE 'APPOINTMENTS';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT;

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");
