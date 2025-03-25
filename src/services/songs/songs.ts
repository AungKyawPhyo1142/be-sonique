import supabase from '@/config/supabase';
import prisma from '@/libs/prisma';
import logger from '@/logger';
import { BadRequestError, InternalServerError } from '@/utils/errors';

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

const getAllGenres = async () => {
  try {
    const res = await prisma.songGenre.findMany();
    return res;
  } catch (error) {
    logger.error('Error getting all genres', error);
    throw error;
  }
};

const getAllSongs = async (cursor?: string, limit: number = 10) => {
  try {
    const res = await prisma.song.findMany({
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      orderBy: {
        create_at: 'desc',
      },
      select: {
        artistId: true,
        coverImageUrl: true,
        duration: true,
        fileUrl: true,
        Genre: {
          select: {
            id: true,
          },
        },
        User: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        id: true,
        title: true,
        create_at: true,
      },
    });

    const nextCursor =
      res.length === limit ? res[res.length - 1].id : undefined;

    return {
      songs: res.map((song) => ({
        artist: {
          artistId: song.artistId,
          name: `${song.User.firstName} ${song.User.lastName}`,
          username: song.User.username,
        },
        audioUrl: song.fileUrl,
        coverImageUrl: song.coverImageUrl,
        duration: song.duration,
        genre: song.Genre.id,
        id: song.id,
        title: song.title,
        created_at: song.create_at,
      })),
      nextCursor,
      hasMore: res.length === limit,
    };
  } catch (error) {
    logger.error('Error getting all songs', error);
    throw error;
  }
};

const getSongsByGenre = async (genreId: number) => {
  try {
    const res = await prisma.song.findMany({
      select: {
        artistId: true,
        coverImageUrl: true,
        duration: true,
        fileUrl: true,
        Genre: {
          select: {
            id: true,
          },
        },
        id: true,
        title: true,
      },
      where: {
        genreId: genreId,
      },
    });
    return res.map((song) => ({
      artistId: song.artistId,
      audioUrl: song.fileUrl,
      coverImageUrl: song.coverImageUrl,
      duration: song.duration,
      genre: song.Genre.id,
      id: song.id,
      title: song.title,
    }));
  } catch (error) {
    logger.error('Error getting song by genre', error);
    throw error;
  }
};

const deleteSong = async (songId: string) => {
  try {
    const songDb = await prisma.song.findUnique({
      where: {
        id: songId,
      },
    });

    if (!songDb) {
      throw new BadRequestError('Song not found with this id');
    }

    // delete the coverImage in Supabase
    if (songDb.coverImage) {
      const { error } = await supabase.storage
        .from('songs')
        .remove([`cover-image/${songDb.coverImage}`]);
      if (error) {
        logger.error('Error deleting the cover image in supabase: ', error);
        throw new InternalServerError(
          'Error deleting the cover image in supabase',
        );
      }
    }

    // delete the audio file in Supabase
    if (songDb.fileName) {
      const { error } = await supabase.storage
        .from('songs')
        .remove([`audio/${songDb.fileName}`]);
      if (error) {
        logger.error('Error deleting the audio file in supabase: ', error);
        throw new InternalServerError(
          'Error deleting the audio file in supabase',
        );
      }
    }

    const res = await prisma.song.delete({
      where: {
        id: songId,
      },
    });

    // delete all likes for this song
    await prisma.likeSong.deleteMany({
      where: {
        songId: songId,
      },
    });

    return res;
  } catch (error) {
    logger.error('Error deleting song', error);
    throw error;
  }
};

const getSongsByArtist = async (artistId: number) => {
  try {
    const res = await prisma.song.findMany({
      select: {
        albumId: true,
        artistId: true,
        coverImageUrl: true,
        duration: true,
        fileUrl: true,
        Genre: {
          select: {
            id: true,
          },
        },
        id: true,
        title: true,
        create_at: true,
      },
      where: {
        artistId: artistId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error getting songs by artist', error);
    throw error;
  }
};

const likeSong = async (songId: string, userId: number) => {
  try {
    const res = await prisma.likeSong.create({
      data: {
        songId: songId,
        userId: userId,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error liking song', error);
    throw error;
  }
};

const getAllUserLikedSongs = async (userId: number) => {
  try {
    const res = await prisma.likeSong.findMany({
      select: {
        song: {
          select: {
            artistId: true,
            coverImageUrl: true,
            duration: true,
            fileUrl: true,
            Genre: {
              select: {
                id: true,
              },
            },
            id: true,
            title: true,
          },
        },
      },
      where: {
        userId: userId,
      },
    });
    return res;
  } catch (error) {
    logger.error("Error getting user's liked songs: ", error);
    throw error;
  }
};

const getSongDetails = async (songId: string) => {
  try {
    const res = await prisma.song.findUnique({
      select: {
        artistId: true,
        coverImageUrl: true,
        duration: true,
        fileUrl: true,
        Genre: {
          select: {
            id: true,
            name: true,
          },
        },
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
      where: {
        id: songId,
      },
    });
    return {
      artist: {
        id: res?.artistId,
        name: `${res?.User?.firstName} ${res?.User?.lastName}`,
        username: res?.User.username,
      },
      audioURL: res?.fileUrl,
      coverImageURL: res?.coverImageUrl,
      duration: res?.duration,
      genre: res?.Genre,
      id: res?.id,
      title: res?.title,
    };
  } catch (error) {
    logger.error('Error getting song details: ', error);
    throw error;
  }
};

export {
  uploadSong,
  createGenre,
  getAllSongs,
  getSongsByGenre,
  getAllGenres,
  deleteSong,
  getSongsByArtist,
  likeSong,
  getAllUserLikedSongs,
  getSongDetails,
};
