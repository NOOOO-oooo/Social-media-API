/*
  Warnings:

  - Added the required column `data` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "data" TEXT NOT NULL;
