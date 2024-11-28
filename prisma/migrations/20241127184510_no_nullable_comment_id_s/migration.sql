/*
  Warnings:

  - Made the column `comment_id` on table `likes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_id_fkey";

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "comment_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("comment_id") ON DELETE RESTRICT ON UPDATE CASCADE;
