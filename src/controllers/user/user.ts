import * as userService from '@/services/user/user';
import { NextFunction, Request, Response } from 'express';
import { ZodError, object, string } from 'zod';

const updateUserSchema = object({
  bio: string().optional(),
  email: string().email().optional(),
  firstName: string().optional(),
  lastName: string().optional(),
  profileImage: string().optional(),
  username: string().optional(),
});
const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userDetails = await userService.getUserDetails(id);
    return res.status(200).json(userDetails);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userDetails = await userService.deleteUser(id);
    return res.status(200).json(userDetails);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { bio, email, firstName, lastName, profileImage, username } =
      updateUserSchema.parse(req.body);
    const userDetails = await userService.updateUser(
      id,
      username,
      firstName,
      lastName,
      bio,
      profileImage,
      email,
    );
    return res.status(200).json(userDetails);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues);
    } else {
      return next(error);
    }
  }
};

export { getUserDetails, deleteUser, updateUser };
