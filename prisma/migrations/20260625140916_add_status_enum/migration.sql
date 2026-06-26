/*
  Warnings:

  - The `status` column on the `entries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "entries" DROP COLUMN "status",
ADD COLUMN     "status" "EntryStatus" NOT NULL DEFAULT 'PENDING';
