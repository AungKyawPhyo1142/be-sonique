import prisma from '@/libs/prisma';
import logger from '@/logger';
import { ConflictError } from '@/utils/errors';
import bcrypt from 'bcryptjs';

const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  username: string,
) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const result = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: passwordHash,
        username,
      },
    });
    return {
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      username: result.username,
    };
  } catch (error) {
    logger.error('Error register user', error);
    throw error;
  }
};

export { registerUser };
