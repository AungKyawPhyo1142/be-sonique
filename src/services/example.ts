// Services are the core business logic

const sum = (a: number, b: number): number => {
  return a + b;
};

const getRandom = (): number => {
  return Math.floor(Math.random() * 100);
};

export { sum, getRandom };
