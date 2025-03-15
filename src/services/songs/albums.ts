import supabase from '@/config/supabase';
import prisma from '@/libs/prisma';
import logger from '@/logger';
import { BadRequestError, InternalServerError } from '@/utils/errors';
import { readFileSync, unlinkSync } from 'fs';

const createAlbum = async (
  artistId: number,
  coverImageUrl: string,
  coverImageFileName: string,
  name: string,
  description: string,
) => {
  try {
    const res = await prisma.album.create({
      data: {
        artistId,
        coverImage: coverImageFileName,
        coverImageUrl: coverImageUrl,
        description,
        name,
      },
    });

    return {
      artistId: res.artistId,
      coverImageUrl: res.coverImageUrl,
      description: res.description,
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
        description: true,
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
        description: true,
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

const addSongsToAlbum = async (albumId: number, songIds: string[]) => {
  try {
    const res = await prisma.album.update({
      data: {
        songs: {
          connect: songIds.map((songId) => ({ id: songId.toString() })),
        },
      },
      include: {
        songs: true,
      },
      where: {
        id: albumId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error adding songs to album', error);
    throw error;
  }
};

const removeSongsFromAlbum = async (albumId: number, songIds: string[]) => {
  try {
    const res = await prisma.album.update({
      data: {
        songs: {
          disconnect: songIds.map((songId) => ({ id: songId.toString() })),
        },
      },
      include: {
        songs: true,
      },
      where: {
        id: albumId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error removing songs from album', error);
    throw error;
  }
};

const updateAlbum = async (
  albumId: number,
  coverImage?: Express.Multer.File,
  name?: string,
  description?: string,
) => {
  if (!albumId) {
    throw new BadRequestError('Album id is required');
  }

  try {
    const existingAlbum = await prisma.album.findUnique({
      where: {
        deleted_at: null,
        id: albumId,
      },
    });

    if (!existingAlbum) {
      throw new BadRequestError('Album not found');
    }

    let coverImageURL = existingAlbum.coverImageUrl;

    if (coverImage) {
      const imageBuffer = readFileSync(coverImage.path);
      const fileName = `${albumId}-${coverImage.originalname}-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from('albums')
        .upload(`cover-image/${fileName}`, imageBuffer, {
          cacheControl: '3600',
          contentType: coverImage.mimetype,
          upsert: true,
        });

      if (uploadError) {
        logger.error('Cover iamge upload error: ', uploadError);
        throw new InternalServerError(
          `Error uploading cover image: ${uploadError.message}`,
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('albums')
        .getPublicUrl(`cover-image/${fileName}`);

      coverImageURL = publicUrl;
      unlinkSync(coverImage.path);
    }

    const res = await prisma.album.update({
      data: {
        coverImage: coverImageURL,
        description,
        name,
      },
      where: {
        id: albumId,
      },
    });
    return {
      artistId: res.artistId,
      coverImageUrl: res.coverImageUrl,
      description: res.description,
      id: res.id,
      name: res.name,
    };
  } catch (error) {
    logger.error('Error updating album', error);
    throw error;
  }
};

export {
  createAlbum,
  getAlbumsByArtistId,
  getAlbumDetails,
  addSongsToAlbum,
  removeSongsFromAlbum,
  updateAlbum,
};
