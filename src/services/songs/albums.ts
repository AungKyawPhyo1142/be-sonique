import prisma from '@/libs/prisma';
import logger from '@/logger';

const createAlbum = async (
  artistId: number,
  coverImageUrl: string,
  coverImageFileName: string,
  name: string,
) => {
  try {
    const res = await prisma.album.create({
      data: {
        artistId,
        coverImage: coverImageFileName,
        coverImageUrl: coverImageUrl,
        name,
      },
    });

    return {
      artistId: res.artistId,
      coverImageUrl: res.coverImageUrl,
      id: res.id,
      name: res.name,
      songs: [],
    };
  } catch (error) {
    logger.error('Error creating album', error);
    throw error;
  }
};

export { createAlbum };
