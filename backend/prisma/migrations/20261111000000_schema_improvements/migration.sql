-- AlterTable: Add status, password reset fields, and unique constraint on mobile_number for users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_token" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_expires" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "users_mobile_number_key" ON "users"("mobile_number");
CREATE UNIQUE INDEX IF NOT EXISTS "users_reset_password_token_key" ON "users"("reset_password_token");
CREATE INDEX IF NOT EXISTS "users_reset_password_token_idx" ON "users"("reset_password_token");

-- AlterTable: Add topic to attendance_sessions
ALTER TABLE "attendance_sessions" ADD COLUMN IF NOT EXISTS "topic" TEXT;

-- AlterTable: Add pinned to announcements
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add pinned, resolved, likes to discussions
ALTER TABLE "discussions" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "discussions" ADD COLUMN IF NOT EXISTS "resolved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "discussions" ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0;
