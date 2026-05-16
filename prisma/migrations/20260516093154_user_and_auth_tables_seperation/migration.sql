/*
  Warnings:

  - You are about to drop the column `appleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `authProviders` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_appleId_key";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_facebookId_key";

-- DropIndex
DROP INDEX "users_googleId_key";

-- DropIndex
DROP INDEX "users_phoneNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "appleId",
DROP COLUMN "authProviders",
DROP COLUMN "email",
DROP COLUMN "facebookId",
DROP COLUMN "googleId",
DROP COLUMN "isEmailVerified",
DROP COLUMN "phoneNumber";

-- CreateTable
CREATE TABLE "user_auth_providers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "deviceType" TEXT,
    "platform" TEXT,
    "appVersion" TEXT,
    "osVersion" TEXT,
    "fcmToken" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_providers_provider_providerId_key" ON "user_auth_providers"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_refreshToken_idx" ON "user_sessions"("refreshToken");

-- AddForeignKey
ALTER TABLE "user_auth_providers" ADD CONSTRAINT "user_auth_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
