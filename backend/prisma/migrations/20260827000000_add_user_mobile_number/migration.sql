-- Persist the mobile number collected during user registration.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mobile_number" TEXT;
