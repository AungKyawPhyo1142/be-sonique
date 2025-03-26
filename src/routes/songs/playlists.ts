import * as playlistController from '@/controllers/songs/playlists';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.post('/create', secureRoute(), playlistController.createPlaylist);
router.get('/:userId', secureRoute(), playlistController.getUserPlaylist);
router.get(
  '/details/:playlistId',
  secureRoute(),
  playlistController.getPlaylistDetails,
);
router.patch('/add-song', secureRoute(), playlistController.addSongsToPlaylist);
router.delete(
  '/remove-song',
  secureRoute(),
  playlistController.removeSongsFromPlaylist,
);

router.patch('/reorder', secureRoute(), playlistController.reorderPlaylist);
router.delete('/delete', secureRoute(), playlistController.deletePlaylist);

export default router;
