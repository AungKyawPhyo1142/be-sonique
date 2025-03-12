import prisma from '@/libs/prisma';
import logger from '@/logger';
import { ConflictError, NotFoundError } from '@/utils/errors';

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
      select: {
        created_at: true,
        deleted_at: true,
        id: true,
        name: true,
        songs: true,
        updated_at: true,
        userId: true,
      },
      where: {
        userId: userId,
      },
    });
    return res.map((list) => ({
      created_at: list.created_at,
      deleted_at: list.deleted_at,
      id: list.id,
      name: list.name,
      total_songs: list.songs.length,
      updated_at: list.updated_at,
      userId: list.userId,
    }));
  } catch (error) {
    logger.error("Error getting user's playlist: ", error);
    throw error;
  }
};

const addSongsToPlaylist = async (
  playlistId: number,
  songIds: string[],
  userId: number,
) => {
  try {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!playlist) {
      throw new NotFoundError('Playlist not found!');
    }

    const createPromises = songIds.map((songId) =>
      prisma.playlistSong
        .create({
          data: {
            playlistId: playlistId,
            songId: songId,
          },
        })
        .catch((e) => {
          if (e.code === 'P2002') {
            return null;
          }
          throw e;
        }),
    );
    await Promise.all(createPromises);

    const updatePlaylist = await prisma.playlist.findUnique({
      include: {
        songs: {
          include: {
            song: true,
          },
        },
      },
      where: {
        id: playlistId,
      },
    });
    return updatePlaylist;
  } catch (error) {
    logger.error('Error adding songs to playlist: ', error);
    return error;
  }
};



const getPlaylistDetails = async (playlistId: number) => {
  try {
    const result = await prisma.playlist.findUnique({
      select: {
        created_at: true,
        id: true,
        name: true,
        songs: {
          select: {
            song: {
              select: {
                artistId: true,
                coverImageUrl: true,
                duration: true,
                fileUrl: true,
                id: true,
                title: true,
                User: {
                  select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: playlistId,
      },
    });
    return {
      created_at: result?.created_at,
      id: result?.id,
      name: result?.name,
      songs:
        result?.songs.map((item) => ({
          artist: {
            name: `${item.song.User.firstName} ${item.song.User.lastName}`,
            username: item.song.User.username,
          },
          coverImageUrl: item.song.coverImageUrl,
          duration: item.song.duration,
          fileUrl: item.song.fileUrl,
          id: item.song.id,
          title: item.song.title,
        })) || [],
    };
  } catch (error) {
    logger.error('Error getting playlist details: ', error);
    return error;
  }
};

export {
  createPlaylist,
  getUserPlaylist,
  addSongsToPlaylist,
  getPlaylistDetails,
};
