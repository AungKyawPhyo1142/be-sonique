import authRouter from '@/routes/auth/auth';
import exampleRouter from '@/routes/example';
import albumRouter from '@/routes/songs/albums';
import songRouter from '@/routes/songs/songs';
import userRouter from '@/routes/user/user';
import { Router } from 'express';

const gateway = Router();
gateway.use('/example', exampleRouter);
gateway.use('/auth', authRouter);
gateway.use('/user', userRouter);
gateway.use('/songs', songRouter);
gateway.use('/album', albumRouter);

export default gateway;
