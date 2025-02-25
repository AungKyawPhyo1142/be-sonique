import prisma from '@/libs/prisma';
import logger from '@/logger';

const uploadSong = async (
  artistId: number,
  audioUrl: string,
  audioFileName: string,
  coverImageUrl: string,
  coverImageFileName: string,
  genre: string,
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
        genre,
        title,
      },
    });

    return {
      artistId: result.artistId,
      audioUrl: result.fileUrl,
      coverImageUrl: result.coverImageUrl,
      genre: result.genre,
      title: result.title,
    };
  } catch (error) {
    logger.error('Error uploading song', error);
    throw error;
  }

  return {
    artistId,
    audioUrl,
    coverImageUrl,
    genre,
    title,
  };
};

export { uploadSong };
