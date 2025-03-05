import * as albumController from '@/controllers/songs/albums';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

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

export default router;
