// REST API ROUTES, keep them clean & short :)
import * as exampleController from '@/controllers/example';
import { Router } from 'express';

const router = Router();

router.get('/', exampleController.getRandom);
router.get('/sum', exampleController.sumQuery);
router.post('/sum', exampleController.sum);

export default router;
