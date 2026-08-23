-- AlterEnum
ALTER TYPE "OtpContext" ADD VALUE 'TWO_FA_SETUP';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
