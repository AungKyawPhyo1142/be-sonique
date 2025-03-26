/*
  Warnings:

  - A unique constraint covering the columns `[playlistId,order]` on the table `PlaylistSong` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `PlaylistSong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaylistSong" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_playlistId_order_key" ON "PlaylistSong"("playlistId", "order");
