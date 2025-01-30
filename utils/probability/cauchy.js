import { processContinuousData } from "./stats";

export default function simulateCauchy({ x0, gamma, N }) {
  const rawData = Array.from(
    { length: N },
    () => x0 + gamma * Math.tan(Math.PI * (Math.random() - 0.5))
  );

  return processContinuousData(rawData, `Cauchy (x₀=${x0}, γ=${gamma})`);
}
