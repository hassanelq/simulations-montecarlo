import { sampleGamma, processContinuousData } from "./stats";

export default function simulateBeta({ alpha, beta, N }) {
  // Parameter validation
  if (alpha <= 0 || beta <= 0) throw new Error("Alpha and Beta must be > 0");
  if (N <= 0) throw new Error("Number of simulations must be positive");

  const rawData = Array.from({ length: N }, () => {
    const gamma1 = sampleGamma(alpha, 1);
    const gamma2 = sampleGamma(beta, 1);
    return gamma1 / (gamma1 + gamma2); // Beta distribution formula
  });

  const result = processContinuousData(rawData, `Beta (α=${alpha}, β=${beta})`);

  // Add beta-specific statistics
  result.statistics = {
    ...result.statistics,
    "Alpha Parameter": alpha.toFixed(2),
    "Beta Parameter": beta.toFixed(2),
    // "Theoretical Mean": (alpha / (alpha + beta)).toFixed(4),
    // "Theoretical Variance": (
    //   (alpha * beta) /
    //   ((alpha + beta) ** 2 * (alpha + beta + 1))
    // ).toFixed(4),
  };

  return result;
}
