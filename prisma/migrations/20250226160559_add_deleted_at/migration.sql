/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SongGenre` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SongGenre` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `SongGenre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SongGenre" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
