/*
  Warnings:

  - A unique constraint covering the columns `[listingId,userId,leadType]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lead_listingId_userId_leadType_key" ON "Lead"("listingId", "userId", "leadType");
