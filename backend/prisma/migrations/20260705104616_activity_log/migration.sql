-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LOGIN', 'PASSWORD_CHANGED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED', 'PHONE_CHANGED', 'PROFILE_UPDATED', 'PROFILE_PHOTO_CHANGED');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT,
    "ipAddress" TEXT,
    "deviceLabel" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_userId_createdAt_idx" ON "ActivityLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
