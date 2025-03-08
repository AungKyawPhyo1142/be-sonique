import * as songController from '@/controllers/songs/songs';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.get('/all', secureRoute(), songController.getAllSongs);
router.delete('/:songId', secureRoute(), songController.deleteSong);
router.get('/genres/:genreId', secureRoute(), songController.getSongsByGenre);
router.get('/genres', secureRoute(), songController.getAllGenres);
router.get('/artist/:artistId', secureRoute(), songController.getSongsByArtist);
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
