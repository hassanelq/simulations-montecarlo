import { processContinuousData } from "./stats";

export default function simulateTriangular({ a, b, c, N }) {
  const rawData = Array.from({ length: N }, () => {
    const u = Math.random();
    return u < (c - a) / (b - a)
      ? a + Math.sqrt(u * (b - a) * (c - a))
      : b - Math.sqrt((1 - u) * (b - a) * (b - c));
  });
  return processContinuousData(rawData, `Triangular (a=${a}, b=${b}, c=${c})`);
}
