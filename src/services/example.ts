// Services are the core business logic
import { getData, setData } from '@/config/redis';

const sum = (a: number, b: number): number => {
  return a + b;
};

const getRandom = (): number => {
  return Math.floor(Math.random() * 100);
};

const testCache = async (): Promise<string> => {
  const cachedData = await getData<string>('test');
  if (cachedData) {
    return cachedData;
  } else {
    const data = 'Hi mom!';
    await setData('test', data);
    return data;
  }
};

export { sum, getRandom, testCache };
