import { processContinuousData } from "./stats";

export default function simulatePareto({ alpha, xm, N }) {
  const rawData = Array.from(
    { length: N },
    () => xm / Math.pow(Math.random(), 1 / alpha)
  );
  return processContinuousData(rawData, `Pareto (α=${alpha}, xₘ=${xm})`);
}
