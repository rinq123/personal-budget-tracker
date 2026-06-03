/*
  Warnings:

  - You are about to drop the column `month` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Budget` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Budget_userId_categoryId_month_year_key";

-- DropIndex
DROP INDEX "Budget_userId_year_month_idx";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "month",
DROP COLUMN "year";

-- CreateIndex
CREATE INDEX "Budget_userId_idx" ON "Budget"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_categoryId_key" ON "Budget"("userId", "categoryId");
