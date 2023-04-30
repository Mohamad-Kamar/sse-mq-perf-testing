export const withTimeMeasurement = async (func, ...args) => {
  const start = Date.now();
  const results = await func(args);
  const end = Date.now();
  const elapsedTime = end - start;
  return [elapsedTime, results];
};
