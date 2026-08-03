-- AlterTable
ALTER TABLE "HairBeautyAndWellness" ADD COLUMN     "detaileddescription" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "experienceLevel" TEXT,
ADD COLUMN     "genderPreference" TEXT,
ADD COLUMN     "preparationTime" TEXT,
ADD COLUMN     "serviceLocationType" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "studioLocation" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "whoIsThisFor" TEXT;
