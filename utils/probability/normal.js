import { processContinuousData, normalSample } from "./stats";

export default function simulateNormal({ mu, sigma, N }) {
  // Add parameter validation
  if (sigma <= 0) throw new Error("Sigma must be positive");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => mu + sigma * normalSample());

  return processContinuousData(rawData, `Normal (μ=${mu}, σ=${sigma})`);
}
