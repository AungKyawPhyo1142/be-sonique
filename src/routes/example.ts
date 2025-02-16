// REST API ROUTES, keep them clean & short :)
import { Router } from 'express';
import * as exampleController from '@/controllers/example'

const router = Router();

router.get('/', exampleController.getRandom);
router.get('/sum', exampleController.sumQuery);
router.post('/sum', exampleController.sum);

export default router;
