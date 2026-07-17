-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ESEWA', 'KHALTI', 'CONNECT_IPS');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod";
