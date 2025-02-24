import prisma from '@/libs/prisma';
import logger from '@/logger';
import { BadRequestError } from '@/utils/errors';

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
        lastName: true,
        profile_image: true,
        username: true,
      },
      where: { deleted_at: null, id: +id },
    });
    if (!result) {
      throw new BadRequestError('User not found');
    }
    return result;
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

export { getUserDetails, deleteUser };
