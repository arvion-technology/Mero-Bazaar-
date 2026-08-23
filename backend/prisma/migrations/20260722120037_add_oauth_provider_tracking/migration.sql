-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'OAUTH_PROVIDED_LINKED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastOAuthProvider" TEXT;
