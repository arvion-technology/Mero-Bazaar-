-- Security hardening: step-up reauthentication context, review uniqueness, medical licence uniqueness

-- 1) Add REAUTH to OtpContext enum
ALTER TYPE "OtpContext" ADD VALUE IF NOT EXISTS 'REAUTH';

-- 2) Prevent duplicate reviews per user/listing (review spam)
CREATE UNIQUE INDEX IF NOT EXISTS "Review_userId_listingId_key" ON "Review"("userId", "listingId");

-- 3) Prevent duplicate NMC licence numbers across medical listings (identity impersonation)
CREATE UNIQUE INDEX IF NOT EXISTS "MedicalAndDental_nmcLicenseNumber_key" ON "MedicalAndDental"("nmcLicenseNumber");
