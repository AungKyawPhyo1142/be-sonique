import * as userService from '@/services/user/user';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError, object, string } from 'zod';

const profileUpload = multer({
  dest: 'profile-upload/',
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
});

const updateUserSchema = object({
  bio: string().optional(),
  email: string().email().optional(),
  firstName: string().optional(),
  lastName: string().optional(),
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
    const { bio, email, firstName, lastName, username } =
      updateUserSchema.parse(req.body);

    let profileImage;
    if (
      req.files &&
      'profile_image' in req.files &&
      req.files.profile_image[0]
    ) {
      const imageFile = req.files['profile_image'][0];

      // Validate image type
      if (
        !imageFile.mimetype.match(/^image\/.+/) &&
        !imageFile.mimetype.includes('octet-stream')
      ) {
        return res.status(400).json({
          message: `Invalid image type: ${imageFile.mimetype}`,
        });
      }

      profileImage = imageFile;
    }

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

const activateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userDetails = await userService.activateArtist(id);
    return res.status(200).json(userDetails);
  } catch (error) {
    return next(error);
  }
};

const deactivateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userDetails = await userService.deactivateArtist(id);
    return res.status(200).json(userDetails);
  } catch (error) {
    return next(error);
  }
};

const getAllArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cursor, limit, search } = req.query;
    const paramLimit = limit ? parseInt(limit as string) : undefined;
    const result = await userService.getAllArtists(cursor as string, paramLimit, search as string);
    return res.status(200).json(result);

  } catch (error) {
    return next(error);
  }
}

export {
  getUserDetails,
  deleteUser,
  updateUser,
  profileUpload,
  activateArtist,
  deactivateArtist,
  getAllArtists
};
