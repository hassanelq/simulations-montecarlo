import { sampleGamma, processContinuousData } from "./stats";

export default function simulateBeta({ alpha, beta, N }) {
  const rawData = Array.from({ length: N }, () => {
    const gamma1 = sampleGamma(alpha, 1);
    const gamma2 = sampleGamma(beta, 1);
    return gamma1 / (gamma1 + gamma2);
  });

  return processContinuousData(rawData, `Beta (α=${alpha}, β=${beta})`);
}
