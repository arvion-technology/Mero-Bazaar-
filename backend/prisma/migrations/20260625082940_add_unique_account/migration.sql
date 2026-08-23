/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `vendorKyc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vendorKyc_address_key" ON "vendorKyc"("address");
