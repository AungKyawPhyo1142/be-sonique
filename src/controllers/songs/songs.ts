import supabase from '@/config/supabase';
import logger from '@/logger';
import * as songService from '@/services/songs/songs';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import multer from 'multer';
import * as mm from 'music-metadata';
import { ZodError, object, string } from 'zod';

const upload = multer({
  dest: 'upload/',
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
});

const uploadSongSchema = object({
  artistId: string(),
  genreId: string(),
  title: string(),
});

const createGenreSchema = object({
  name: string(),
});

const uploadSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { artistId, genreId, title } = uploadSongSchema.parse(req.body);

    if (
      !req.files ||
      !('audio' in req.files) ||
      !req.files.audio[0] ||
      !('coverImage' in req.files) ||
      !req.files.coverImage[0]
    ) {
      return res.status(400).json({
        message: 'Audio file and cover image are required',
      });
    }

    const audioFile = req.files['audio'][0];
    const coverImageFile = req.files['coverImage'][0];

    // Accept common audio formats and octet-stream (since some systems might send it this way)
    const validAudioTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'application/octet-stream',
    ];

    if (!validAudioTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({
        message: `Invalid audio file type: ${audioFile.mimetype}. Supported types: ${validAudioTypes.join(', ')}`,
      });
    }

    // For images, we'll keep the existing check but make it more permissive
    if (
      !coverImageFile.mimetype.match(/^image\/.+/) &&
      !coverImageFile.mimetype.includes('octet-stream')
    ) {
      return res.status(400).json({
        message: `Invalid cover image type: ${coverImageFile.mimetype}`,
      });
    }

    // get the audio file duration
    const audioMetaData = await mm.parseFile(audioFile.path);
    const audioDuration = audioMetaData.format.duration || 0;

    if (!audioDuration || audioDuration <= 0) {
      return res.status(400).json({
        message: 'Could not determine the audio duration or invalid audio file',
      });
    }

    //uplaod to supabase
    const audioBuffer = readFileSync(audioFile.path);
    const coverImageBuffer = readFileSync(coverImageFile.path);

    const audioFileName = `${artistId}-${title}-${audioFile.originalname}-${Date.now()}`;
    const coverImageFileName = `${artistId}-${title}-${coverImageFile.originalname}-${Date.now()}`;

    // upload the audio file
    const { error: audioError } = await supabase.storage
      .from('songs')
      .upload(`audio/${audioFileName}`, audioBuffer, {
        cacheControl: '3600',
        contentType: audioFile.mimetype,
        upsert: true,
      });

    if (audioError) {
      logger.error('Audio upload error details:', {
        bucketPath: 'songs/audio',
        contentType: audioFile.mimetype,
        error: audioError,
        fileName: audioFileName,
      });
      throw new Error(`Error uploading audio file: ${audioError.message}`);
    }

    // upload the cover image
    const { error: coverImageError } = await supabase.storage
      .from('songs')
      .upload(`cover-image/${coverImageFileName}`, coverImageBuffer, {
        cacheControl: '3600',
        contentType: 'image/jpeg',
        upsert: true, // Changed to true to allow overwriting
      });

    if (coverImageError) {
      logger.error('Cover image upload error:', coverImageError);
      throw new Error(
        `Error uploading cover image: ${coverImageError.message}`,
      );
    }

    // Get public URLs (fixed path structure)
    const audioUrl = supabase.storage
      .from('songs')
      .getPublicUrl(`audio/${audioFileName}`);
    const coverImageUrl = supabase.storage
      .from('songs')
      .getPublicUrl(`cover-image/${coverImageFileName}`);

    // cleanup the temp files
    unlinkSync(audioFile.path);
    unlinkSync(coverImageFile.path);

    const response = await songService.uploadSong(
      artistId ? parseInt(artistId) : 0,
      audioUrl.data.publicUrl,
      audioFileName,
      coverImageUrl.data.publicUrl,
      coverImageFileName,
      genreId ? parseInt(genreId) : 0,
      title,
      audioDuration,
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

const createGenre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = createGenreSchema.parse(req.body);
    const result = await songService.createGenre(name);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

const getAllGenres = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await songService.getAllGenres();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getAllSongs = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await songService.getAllSongs();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getSongsByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { genreId } = req.params;
    logger.debug('genreId: ', genreId);
    const result = await songService.getSongsByGenre(parseInt(genreId));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export {
  uploadSong,
  upload,
  createGenre,
  getAllSongs,
  getSongsByGenre,
  getAllGenres,
};
