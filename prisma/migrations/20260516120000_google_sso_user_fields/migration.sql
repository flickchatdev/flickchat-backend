-- AlterTable: optional phone, unique email for Google SSO
ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
