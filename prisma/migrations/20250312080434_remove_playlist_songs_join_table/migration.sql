/*
  Warnings:

  - You are about to drop the `PlaylistSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_songId_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "playlistId" INTEGER;

-- DropTable
DROP TABLE "PlaylistSong";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
