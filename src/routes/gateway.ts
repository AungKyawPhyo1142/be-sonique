import authRouter from '@/routes/auth/auth';
import exampleRouter from '@/routes/example';
import userRouter from '@/routes/user/user';
import songRouter from '@/routes/songs/songs';
import { Router } from 'express';

const gateway = Router();
gateway.use('/example', exampleRouter);
gateway.use('/auth', authRouter);
gateway.use('/songs', songRouter);
gateway.use('/user', userRouter);

export default gateway;
