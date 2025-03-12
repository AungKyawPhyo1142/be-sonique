import * as playlistController from '@/controllers/songs/playlists';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.post('/create', secureRoute(), playlistController.createPlaylist);
router.get('/:userId', secureRoute(), playlistController.getUserPlaylist);

export default router;
