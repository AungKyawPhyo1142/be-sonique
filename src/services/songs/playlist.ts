import prisma from '@/libs/prisma';
import logger from '@/logger';
import { ConflictError, NotFoundError } from '@/utils/errors';

const createPlaylist = async (userId: number, name: string) => {
  try {
    let playlistName = name.trim() || 'untitled';

    const lastUntitledPlaylist = await prisma.playlist.findFirst({
      orderBy: {
        name: 'desc',
      },
      select: {
        name: true,
      },
      where: {
        name: {
          mode: 'insensitive',
          startsWith: 'untitled',
        },
        userId: userId,
      },
    });

    if (playlistName.toLowerCase() === 'untitled') {
      const extractNumber = (name: string) => {
        const match = name.match(/untitled-?(\d+)$/i);
        return match ? parseInt(match[1], 10) : 0;
      };
      const nextNumber = lastUntitledPlaylist
        ? extractNumber(lastUntitledPlaylist.name) + 1
        : 1;

      playlistName = `untitled-${nextNumber}`;
    }

    const existingPlaylist = await prisma.playlist.findFirst({
      select: {
        name: true,
      },
      where: {
        name: playlistName,
        userId: userId,
      },
    });

    if (existingPlaylist && existingPlaylist.name === playlistName) {
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

const updatePlaylistName = async (playlistId: number, userId: number) => {
  try {
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!existingPlaylist) {
      throw new NotFoundError('Playlist not found!');
    }

    const updatedPlaylist = await prisma.playlist.update({
      data: {
        name: existingPlaylist.name,
      },
      where: {
        id: playlistId,
      },
    });

    return updatedPlaylist;
  } catch (error) {
    logger.error('Error updating playlist name: ', error);
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

    const existingSongsCount = await prisma.playlistSong.count({
      where: {
        playlistId: playlistId,
      },
    });

    const createPromises = songIds.map((songId, index) =>
      prisma.playlistSong
        .create({
          data: {
            order: existingSongsCount + index + 1, // Assign order based on existing count
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
          orderBy: {
            created_at: 'asc',
          },
          select: {
            order: true,
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
      playlist_coverImageUrl: result?.songs[0]?.song.coverImageUrl,
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
          order: item.order,
          title: item.song.title,
        })) || [],
    };
  } catch (error) {
    logger.error('Error getting playlist details: ', error);
    return error;
  }
};

const removeSongsFromPlaylist = async (
  playlistId: number,
  songIds: string[],
  userId: number,
) => {
  try {
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!existingPlaylist) {
      throw new NotFoundError('Playlist not found!');
    }

    await prisma.playlistSong.deleteMany({
      where: {
        playlistId,
        songId: {
          in: songIds,
        },
      },
    });

    return await getPlaylistDetails(playlistId);
  } catch (error) {
    logger.error('Error removing songs from playlist: ', error);
    throw error;
  }
};

const deletePlaylist = async (playlistId: number, userId: number) => {
  try {
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!existingPlaylist) {
      throw new NotFoundError('Playlist not found!');
    }

    await prisma.playlist.delete({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    return {
      message: 'Playlist deleted successfully',
    };
  } catch (error) {
    logger.error('Error deleting playlist: ', error);
    throw error;
  }
};

const reorderPlaylistSongs = async (
  playlistId: number,
  orderedSongIds: string[],
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

    const updatePromises = orderedSongIds.map((songId, index) =>
      prisma.playlistSong.updateMany({
        data: {
          order: index + 1, // Assign order based on the index
        },
        where: {
          playlistId: playlistId,
          songId: songId,
        },
      }),
    );

    await Promise.all(updatePromises);

    return await getPlaylistDetails(playlistId);
  } catch (error) {
    logger.error('Error reordering playlist songs: ', error);
    throw error;
  }
};

export {
  createPlaylist,
  getUserPlaylist,
  addSongsToPlaylist,
  removeSongsFromPlaylist,
  getPlaylistDetails,
  deletePlaylist,
  reorderPlaylistSongs,
  updatePlaylistName,
};
