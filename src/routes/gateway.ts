import { Router } from "express";
import exampleRouter from '@/routes/example'

const gateway = Router();
gateway.use('/example', exampleRouter);

export default gateway;