-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "status" "EntryStatus" NOT NULL DEFAULT 'PROCESSING';
