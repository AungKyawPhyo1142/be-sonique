import * as songController from '@/controllers/songs/songs';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.post(
  '/upload',
  secureRoute(),
  songController.upload.fields([
    { maxCount: 1, name: 'audio' },
    { maxCount: 1, name: 'coverImage' },
  ]),
  songController.uploadSong,
);
router.post('/genres', secureRoute(), songController.createGenre);

export default router;
