-- Allow auth-created users to exist before profile completion.
ALTER TABLE "users" ALTER COLUMN "fullName" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "users_phoneNumber_key" ON "users"("phoneNumber");
