import { sampleGamma, processContinuousData } from "./stats";

export default function simulateGamma({ k, theta, N }) {
  const rawData = Array.from({ length: N }, () => sampleGamma(k, theta));
  return processContinuousData(rawData, `Gamma (k=${k}, θ=${theta})`);
}
