/*
  Warnings:

  - You are about to drop the column `email` on the `user_auth_providers` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user_auth_providers` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_auth_providers" DROP COLUMN "email",
DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
