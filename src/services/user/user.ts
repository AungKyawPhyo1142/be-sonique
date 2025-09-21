import supabase from '@/config/supabase';
import prisma from '@/libs/prisma';
import logger from '@/logger';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from '@/utils/errors';
import { readFileSync, unlinkSync } from 'fs';

const getUserDetails = async (id: string) => {
  if (!id || id.length === 0 || id === '') {
    throw new BadRequestError('Invalid user id');
  }

  try {
    const result = await prisma.user.findUnique({
      select: {
        bio: true,
        email: true,
        firstName: true,
        id: true,
        isArtist: true,
        lastName: true,
        profile_image: true,
        Song: true,
        username: true,
      },
      where: { deleted_at: null, id: +id },
    });
    if (!result) {
      throw new BadRequestError('User not found');
    }
    return {
      ...result,
      Song: undefined,
      total_songs: result.Song ? result.Song.length : 0,
    };
  } catch (error) {
    logger.error('Error getting user details: ', error);
    throw error;
  }
};

const deleteUser = async (id: string) => {
  if (!id || id.length === 0 || id === '') {
    throw new BadRequestError('Invalid user id');
  }
  try {
    const res = await prisma.user.update({
      data: {
        deleted_at: new Date(),
      },
      where: { id: +id },
    });
    return {
      id: res.id,
      message: 'User deleted successfully',
    };
  } catch (error) {
    logger.error('Error deleting user: ', error);
    throw error;
  }
};

const updateUser = async (
  id: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  bio?: string,
  profileImage?: Express.Multer.File,
  email?: string,
) => {
  if (!id || id.length === 0 || id === '') {
    throw new BadRequestError('Invalid user id');
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { deleted_at: null, id: +id },
    });
    if (!existingUser) {
      throw new BadRequestError('User not found');
    }

    let profileImageURL = existingUser.profile_image;

    if (profileImage) {
      const imageBuffer = readFileSync(profileImage.path);
      const fileName = `${id}-${profileImage.originalname}-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from('users')
        .upload(`profile-images/${fileName}`, imageBuffer, {
          cacheControl: '3600',
          contentType: profileImage.mimetype,
          upsert: true,
        });

      if (uploadError) {
        logger.error('Profile iamge upload error: ', uploadError);
        throw new InternalServerError(
          `Error uploading profile image: ${uploadError.message}`,
        );
      }

      // Delete the existing profile image from Supabase storage after uploading the new one
      const { error: deleteError } = await supabase.storage
        .from('users')
        .remove([`profile-images/${existingUser.profile_image}`]);

      if (deleteError) {
        logger.error('Profile image delete error: ', deleteError);
        throw new InternalServerError(
          `Error deleting profile image: ${deleteError.message}`,
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('users')
        .getPublicUrl(`profile-images/${fileName}`);

      profileImageURL = publicUrl;
      unlinkSync(profileImage.path);
    }

    const result = await prisma.user.update({
      data: {
        bio,
        email,
        firstName,
        lastName,
        profile_image: profileImageURL,
        username,
      },
      where: { id: +id },
    });
    return {
      bio: result.bio,
      email: result.email,
      firstName: result.firstName,
      id: result.id,
      lastName: result.lastName,
      profileImage: result.profile_image,
      username: result.username,
    };
  } catch (error) {
    logger.error('Error updating user: ', error);
    throw error;
  }
};

const activateArtist = async (id: string) => {
  if (!id || id.length === 0 || id === '') {
    throw new BadRequestError('Invalid user id');
  }

  try {
    const dbUser = await prisma.user.findUnique({
      select: { isArtist: true },
      where: { id: +id },
    });

    if (!dbUser) {
      throw new BadRequestError('User not found');
    }

    if (dbUser?.isArtist) {
      throw new ConflictError('User is already an artist');
    }

    const result = await prisma.user.update({
      data: { isArtist: true },
      where: { id: +id },
    });

    return {
      id: result.id,
      isArtist: result.isArtist,
      message: 'User activated as artist successfully',
    };
  } catch (error) {
    logger.error('Error activating artist: ', error);
    throw error;
  }
};

const deactivateArtist = async (id: string) => {
  if (!id || id.length === 0 || id === '') {
    throw new BadRequestError('Invalid user id');
  }

  try {
    const dbUser = await prisma.user.findUnique({
      select: { isArtist: true, Song: true },
      where: { id: +id },
    });

    if (!dbUser) {
      throw new BadRequestError('User not found');
    }

    if (dbUser.Song && dbUser.Song.length > 0) {
      throw new ConflictError('User has songs, cannot deactivate artist');
    }

    const res = await prisma.user.update({
      data: { isArtist: false },
      where: { id: +id },
    });
    return {
      id: res.id,
      isArtist: res.isArtist,
      message: 'User deactivated as artist successfully',
    };
  } catch (error) {
    logger.error('Error deactivating artist: ', error);
    throw error;
  }
};

const getAllArtists = async (
  cursor?: string,
  limit?: number,
  search?: string,
) => {
  try {
    const take = limit || 10;
    

    const [_, artists] = await prisma.$transaction([
      prisma.user.count({
        where: {
          deleted_at: null,
          isArtist: true,
          ...(search && {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
      }),
      prisma.user.findMany({
        take,
        ...(cursor && {
          cursor: {
            id: parseInt(cursor, 10),
          },
          skip: 1,
        }),
        orderBy: {
          created_at: 'desc',
        },
        select: {
          _count: {
            select: {
              Song: true,
            },
          },
          bio: true,
          firstName: true,
          id: true,
          lastName: true,
          profile_image: true,
          username: true,
        },
        where: {
          deleted_at: null,
          isArtist: true,
          ...(search && {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
      }),
    ]);

    const nextCursor =
      artists.length === take ? artists[artists.length - 1].id.toString() : undefined;

    return {
      artists: artists.map((artist) => ({
        bio: artist.bio,
        id: artist.id,
        name: `${artist.firstName} ${artist.lastName}`,
        profile_image: artist.profile_image,
        total_songs: artist._count.Song,
        username: artist.username,
      })),
      hasMore: artists.length === take,
      nextCursor,
    };
  } catch (error) {
    logger.error('Error getting all artists: ', error);
    throw error;
  }
};

export {
  getUserDetails,
  deleteUser,
  updateUser,
  activateArtist,
  deactivateArtist,
  getAllArtists,
};
