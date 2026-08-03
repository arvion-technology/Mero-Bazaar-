-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContractType" ADD VALUE 'CONTRACT';
ALTER TYPE "ContractType" ADD VALUE 'FREELANCE';
ALTER TYPE "ContractType" ADD VALUE 'INTERNSHIP';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PayPeriod" ADD VALUE 'HOURLY';
ALTER TYPE "PayPeriod" ADD VALUE 'BIWEEKLY';
ALTER TYPE "PayPeriod" ADD VALUE 'YEARLY';
