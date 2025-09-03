import * as albumController from '@/controllers/songs/albums';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();
router.get('/', secureRoute(), albumController.getAlbums);
router.get('/:artistId', secureRoute(), albumController.getAlbumsByArtistId);
router.get('/detail/:albumId', secureRoute(), albumController.getAlbumDetails);

router.post(
  '/create',
  secureRoute(),
  albumController.upload.fields([
    {
      maxCount: 1,
      name: 'coverImage',
    },
  ]),
  albumController.createAlbum,
);

router.patch('/update/:albumId', secureRoute(), albumController.updateAlbum);
router.patch('/add-song', secureRoute(), albumController.addSongsToAlbum);
router.delete(
  '/remove-song',
  secureRoute(),
  albumController.removeSongsFromAlbum,
);

export default router;
