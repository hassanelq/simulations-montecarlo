import { processContinuousData } from "./stats";

export default function simulateWeibull({ lambda, k, N }) {
  const rawData = Array.from(
    { length: N },
    () => lambda * Math.pow(-Math.log(1 - Math.random()), 1 / k)
  );
  return processContinuousData(rawData, `Weibull (λ=${lambda}, k=${k})`);
}
