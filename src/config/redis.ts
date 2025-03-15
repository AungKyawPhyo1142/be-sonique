import { ENV } from '@/env';
import logger from '@/logger';
import { createClient } from 'redis';

logger.info('Connecting to Redis');

const redisClient = createClient({
  password: ENV.REDIS_PASSWORD,
  socket: {
    host: ENV.REDIS_URL,
    port: 16328,
  },
  username: 'default',
});
redisClient.on('error', (err) => logger.error('Redis Client Error: ', err));

export const connectRedis = async () => {
  await redisClient.connect();
};

connectRedis();

export const setData = async <T>(key: string, value: T) => {
  await redisClient.set(key, JSON.stringify(value));
};

export const getData = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);
  if (data) {
    return JSON.parse(data) as T;
  } else {
    return null;
  }
};

export default redisClient;
