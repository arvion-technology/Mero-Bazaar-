-- AlterTable
ALTER TABLE "BeautyAppointment" ADD COLUMN     "date" DATE;

-- CreateIndex
CREATE INDEX "BeautyAppointment_slotId_date_idx" ON "BeautyAppointment"("slotId", "date");

-- Prevent double-booking: one active (PENDING/CONFIRMED) appointment per slot per date
CREATE UNIQUE INDEX "beauty_appt_active_slot_date"
ON "BeautyAppointment" ("slotId", "date")
WHERE "status" IN ('PENDING', 'CONFIRMED');