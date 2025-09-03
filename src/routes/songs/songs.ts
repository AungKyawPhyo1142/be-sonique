import * as songController from '@/controllers/songs/songs';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();
// songs
router.get('/all', secureRoute(), songController.getAllSongs);
router.get('/likes', secureRoute(), songController.getAllUserLikedSongs);
router.get('/:songId', secureRoute(), songController.getSongDetails);
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


router.post('/likes', secureRoute(), songController.likeSongs);
router.delete('/:songId', secureRoute(), songController.deleteSong);

// genres
router.post('/genres', secureRoute(), songController.createGenre);
router.get('/genres/all', secureRoute(), songController.getAllGenres);
router.get('/genres/:genreId', secureRoute(), songController.getSongsByGenre);
export default router;
