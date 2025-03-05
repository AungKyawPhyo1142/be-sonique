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

const getAllGenres = async () => {
  try {
    const res = await prisma.songGenre.findMany();
    return res;
  } catch (error) {
    logger.error('Error getting all genres', error);
    throw error;
  }
};

const getAllSongs = async () => {
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
    const res = await prisma.song.delete({
      where: {
        id: songId,
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

export {
  uploadSong,
  createGenre,
  getAllSongs,
  getSongsByGenre,
  getAllGenres,
  deleteSong,
  getSongsByArtist,
};
