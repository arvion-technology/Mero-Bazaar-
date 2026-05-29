/*
  Warnings:

  - You are about to drop the column `latitude` on the `AgricultureAndLivestock` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `AgricultureAndLivestock` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AgricultureAndLivestock_latitude_longitude_idx";

-- AlterTable
ALTER TABLE "AgricultureAndLivestock" DROP COLUMN "latitude",
DROP COLUMN "longitude";
