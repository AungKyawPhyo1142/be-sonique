/*
  Warnings:

  - You are about to drop the column `genre` on the `Song` table. All the data in the column will be lost.
  - Added the required column `genreId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "genre",
ADD COLUMN     "genreId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SongGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongGenre_name_key" ON "SongGenre"("name");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "SongGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
