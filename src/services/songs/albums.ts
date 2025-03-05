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

const getAlbumsByArtistId = async (artistId: number) => {
  try {
    const res = await prisma.album.findMany({
      select: {
        artistId: true,
        coverImageUrl: true,
        created_at: true,
        id: true,
        name: true,
        updated_at: true,
      },
      where: {
        artistId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error getting albums by artist id', error);
    throw error;
  }
};

const getAlbumDetails = async (albumId: number) => {
  try {
    const res = await prisma.album.findUnique({
      select: {
        artistId: true,
        coverImageUrl: true,
        created_at: true,
        id: true,
        name: true,
        songs: {
          select: {
            coverImageUrl: true,
            create_at: true,
            duration: true,
            fileUrl: true,
            id: true,
            title: true,
            updated_at: true,
          },
        },
        updated_at: true,
      },
      where: {
        id: albumId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error getting album details', error);
    throw error;
  }
};

export { createAlbum, getAlbumsByArtistId, getAlbumDetails };
