/*
  Warnings:

  - You are about to drop the column `isBooked` on the `BeautySlot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[beautyId,startTime]` on the table `BeautyAppointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BeautySlot" DROP COLUMN "isBooked";

-- AlterTable
ALTER TABLE "HairBeautyAndWellness" ADD COLUMN     "durationMinutes" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "BeautyAppointment_beautyId_startTime_key" ON "BeautyAppointment"("beautyId", "startTime");
