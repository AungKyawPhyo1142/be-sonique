import * as userController from '@/controllers/auth/user';
import { Router } from 'express';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
