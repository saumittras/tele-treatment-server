/*
  Warnings:

  - You are about to drop the column `srartDateTime` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `startDateTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "srartDateTime",
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
