import { processContinuousData } from "./stats";

export default function simulateCauchy({ x0, gamma, N }) {
  // Parameter validation
  if (typeof gamma !== "number" || gamma <= 0) {
    throw new Error("Scale parameter γ must be a positive number");
  }
  if (typeof N !== "number" || N <= 0) {
    throw new Error("Number of simulations must be a positive integer");
  }

  const rawData = [];
  let validCount = 0;
  const MAX_ATTEMPTS = N * 10; // Prevent infinite loop
  let attempts = 0;

  while (validCount < N && attempts < MAX_ATTEMPTS) {
    attempts++;
    const value = x0 + gamma * Math.tan(Math.PI * (Math.random() - 0.5));
    if (Math.abs(value) < 1e6) {
      // Practical bounds for visualization
      rawData.push(value);
      validCount++;
    }
  }

  if (validCount < N) {
    throw new Error("Failed to generate sufficient valid Cauchy samples");
  }

  const result = processContinuousData(
    rawData,
    `Cauchy (x₀=${x0}, γ=${gamma})`
  );

  // Add Cauchy-specific statistics
  result.statistics = {
    ...result.statistics,
    "Location Parameter (x₀)": x0.toFixed(4),
    "Scale Parameter (γ)": gamma.toFixed(4),
  };

  return result;
}
