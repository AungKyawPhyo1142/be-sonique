import * as userController from '@/controllers/auth/user';
import { Router } from 'express';

const router = Router();

router.post('/register', userController.registerUser);

export default router;
