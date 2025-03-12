import * as songServices from '@/services/songs/playlist';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { ZodError, array, number, object, string } from 'zod';

const createPlaylistSchema = object({
  name: string(),
  userId: number(),
});

const addSongsToPlaylistSchema = object({
  playlistId: number(),
  songIds: array(string()),
  userId: number(),
});

const createPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, userId } = createPlaylistSchema.parse(req.body);

  try {
    const result = await songServices.createPlaylist(userId, name);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const getUserPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const response = await songServices.getUserPlaylist(+userId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const addSongsToPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, songIds, playlistId } = addSongsToPlaylistSchema.parse(
      req.body,
    );
    const response = await songServices.addSongsToPlaylist(
      playlistId,
      songIds,
      userId,
    );
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const getPlaylistDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { playlistId } = req.params;
    const response = await songServices.getPlaylistDetails(+playlistId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export {
  createPlaylist,
  getUserPlaylist,
  addSongsToPlaylist,
  getPlaylistDetails,
};
