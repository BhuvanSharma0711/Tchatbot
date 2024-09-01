/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_email_key" ON "Ticket"("email");
