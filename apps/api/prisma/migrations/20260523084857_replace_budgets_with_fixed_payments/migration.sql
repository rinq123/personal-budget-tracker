/*
  Warnings:

  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropTable
DROP TABLE "Budget";

-- CreateTable
CREATE TABLE "FixedPayment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "dueDay" INTEGER,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FixedPayment_userId_type_idx" ON "FixedPayment"("userId", "type");

-- CreateIndex
CREATE INDEX "FixedPayment_categoryId_idx" ON "FixedPayment"("categoryId");

-- AddForeignKey
ALTER TABLE "FixedPayment" ADD CONSTRAINT "FixedPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedPayment" ADD CONSTRAINT "FixedPayment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
