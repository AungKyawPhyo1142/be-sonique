import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import expressListRoutes from 'express-list-routes';
import { ENV } from './env';
import logger from './logger';
import jsonResponse from './middlewares/json-response';
import networkLog from './middlewares/network-log';
import gateway from './routes/gateway';
import { NotFoundError } from './utils/errors';

logger.info('Application is starting...');

const app = express();

logger.info('Injecting middlewars & routers...');

app.use(
  cors({
    credentials: true,
    origin: ENV.CORS_ORIGIN,
  }),
);

app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(networkLog);
app.use(jsonResponse);
app.use(cookieParser());

app.get('/', (_req, res) => {
  return res.json({ message: 'Welcome to Sonique API' });
});

app.use(gateway);

app.use((_req, _res, next) => {
  return next(new NotFoundError('Endpoint not found'));
});

app.listen(ENV.PORT, () => {
  logger.verbose(
    `ENV is pointing to ${
      ENV.NODE_ENV !== 'production'
        ? JSON.stringify(ENV, undefined, 2)
        : ENV.NODE_ENV
    }`,
  );
  expressListRoutes(gateway, { logger: false }).forEach((route) => {
    logger.verbose(`${route.method} ${route.path.replaceAll('\\', '/')}`);
  });

  logger.info(`Server is running on http://localhost:${ENV.PORT}`);
});
