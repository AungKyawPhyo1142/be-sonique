// REST API ROUTES, keep them clean & short :)
import * as exampleController from '@/controllers/example';
import secureRoute from '@/middlewares/secure-route';
import { Router } from 'express';

const router = Router();

router.get('/', secureRoute(), exampleController.getRandom);
router.get('/sum', exampleController.sumQuery);
router.post('/sum', exampleController.sum);

export default router;
