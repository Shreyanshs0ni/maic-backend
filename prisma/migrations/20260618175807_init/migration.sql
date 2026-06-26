/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IDEA', 'DREAM', 'PURCHASE', 'TASK', 'JOURNAL_NOTE', 'RANDOM_THOUGHT');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "transcript" TEXT,
    "category" "Category",
    "title" TEXT,
    "tags" TEXT[],
    "mood" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_summaries" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "summaryText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SummaryEntries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SummaryEntries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_summaries_date_key" ON "daily_summaries"("date");

-- CreateIndex
CREATE INDEX "_SummaryEntries_B_index" ON "_SummaryEntries"("B");

-- AddForeignKey
ALTER TABLE "_SummaryEntries" ADD CONSTRAINT "_SummaryEntries_A_fkey" FOREIGN KEY ("A") REFERENCES "daily_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SummaryEntries" ADD CONSTRAINT "_SummaryEntries_B_fkey" FOREIGN KEY ("B") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
