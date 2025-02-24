import * as userService from '@/services/user/user';
import { NextFunction, Request, Response } from 'express';

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

export { getUserDetails, deleteUser };
