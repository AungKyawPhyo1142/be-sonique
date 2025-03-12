import prisma from '@/libs/prisma';
import logger from '@/logger';
import { ConflictError } from '@/utils/errors';

const createPlaylist = async (userId: number, name: string) => {
  try {
    const existingPlaylist = await prisma.playlist.findFirst({
      select: {
        name: true,
      },
      where: {
        name: name,
        userId: userId,
      },
    });
    if (existingPlaylist) {
      throw new ConflictError('Playlist with the same name already exists.');
    }

    const result = await prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });
    return result;
  } catch (error) {
    logger.error('Error creating a playlist: ', error);
    throw error;
  }
};

const getUserPlaylist = async (userId: number) => {
  try {
    const res = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
    });
    return res;
  } catch (error) {
    logger.error("Error getting user's playlist: ", error);
    throw error;
  }
};

export { createPlaylist, getUserPlaylist };
