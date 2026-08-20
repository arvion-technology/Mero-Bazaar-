/*
  Warnings:

  - A unique constraint covering the columns `[beautyId,day,startTime,endTime]` on the table `BeautySlot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medicalId,day,startTime,endTime]` on the table `MedicalSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BeautySlot_beautyId_day_startTime_endTime_key" ON "BeautySlot"("beautyId", "day", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalSlot_medicalId_day_startTime_endTime_key" ON "MedicalSlot"("medicalId", "day", "startTime", "endTime");
