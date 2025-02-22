import * as songController from '@/controllers/songs/songs';
import { Router } from 'express';

const router = Router();

router.post(
  '/upload',
  songController.upload.fields([
    { maxCount: 1, name: 'audio' },
    { maxCount: 1, name: 'coverImage' },
  ]),
  songController.uploadSong,
);

export default router;
