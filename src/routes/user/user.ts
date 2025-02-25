import * as userController from '@/controllers/user/user';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.get('/:id', secureRoute(), userController.getUserDetails);
router.delete('/:id', secureRoute(), userController.deleteUser);
router.patch(
  '/:id',
  userController.profileUpload.fields([{ maxCount: 1, name: 'profile_image' }]),
  userController.updateUser,
);

export default router;
