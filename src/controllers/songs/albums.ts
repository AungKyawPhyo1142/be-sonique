import supabase from '@/config/supabase';
import logger from '@/logger';
import * as albumService from '@/services/songs/albums';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import multer from 'multer';
import { ZodError, object, string } from 'zod';

const upload = multer({
  dest: 'album-uopload/',
  limits: {
    fileSize: 20 * 1024 * 1024, // 30MB limit
  },
});

const createAlbumnSchema = object({
  artistId: string(),
  name: string(),
});

const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, artistId } = createAlbumnSchema.parse(req.body);

    if (
      !req.files ||
      !('coverImage' in req.files) ||
      !req.files.coverImage[0]
    ) {
      return res.status(400).json({ error: 'No cover image provided' });
    }

    const coverImageFile = req.files['coverImage'][0];

    const validationCoverImage = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];

    if (!validationCoverImage.includes(coverImageFile.mimetype)) {
      return res.status(400).json({
        message:
          'Invalid cover image format. Accepted formats are: JPG, PNG, JPEG, WEBP',
      });
    }

    const coverImageBuffer = readFileSync(coverImageFile.path);
    const coverImageFileName = `${artistId}-${coverImageFile.originalname}-${Date.now()}`;

    // upload coverImage
    const { error: coverImageError } = await supabase.storage
      .from('albums')
      .upload(`cover-image/${coverImageFileName}`, coverImageBuffer, {
        contentType: coverImageFile.mimetype,
      });
    if (coverImageError) {
      logger.error('Error uploading cover image', coverImageError);
      throw new Error('Error uploading cover image');
    }

    // get the public URL
    const coverImageUrl = supabase.storage
      .from('albums')
      .getPublicUrl(`cover-image/${coverImageFileName}`);

    unlinkSync(coverImageFile.path);

    const response = await albumService.createAlbum(
      artistId ? parseInt(artistId) : 0,
      coverImageFileName,
      coverImageUrl.data.publicUrl,
      name,
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

const getAlbumsByArtistId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { artistId } = req.params;
    const response = await albumService.getAlbumsByArtistId(
      artistId ? parseInt(artistId) : 0,
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getAlbumDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { albumId } = req.params;
    const response = await albumService.getAlbumDetails(
      albumId ? parseInt(albumId) : 0,
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export { createAlbum, upload, getAlbumsByArtistId, getAlbumDetails };
