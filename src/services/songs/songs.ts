import prisma from '@/libs/prisma';
import logger from '@/logger';

const uploadSong = async (
  artistId: number,
  audioUrl: string,
  audioFileName: string,
  coverImageUrl: string,
  coverImageFileName: string,
  genreId: number,
  title: string,
  duration: number,
) => {
  try {
    // we won't be checking for unique song titles
    const result = await prisma.song.create({
      data: {
        artistId,
        coverImage: coverImageFileName,
        coverImageUrl: coverImageUrl,
        duration,
        fileName: audioFileName,
        fileUrl: audioUrl,
        genreId,
        title,
      },
    });

    return {
      artistId: result.artistId,
      audioUrl: result.fileUrl,
      coverImageUrl: result.coverImageUrl,
      genre: result.genreId,
      title: result.title,
    };
  } catch (error) {
    logger.error('Error uploading song', error);
    throw error;
  }
};

const createGenre = async (genre: string) => {
  try {
    const res = await prisma.songGenre.create({
      data: {
        name: genre,
      },
    });
    return {
      id: res.id,
      name: res.name,
    };
  } catch (error) {
    logger.error('Error creating genre', error);
    throw error;
  }
};

export { uploadSong, createGenre };
