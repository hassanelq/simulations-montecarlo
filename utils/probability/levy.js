import { processContinuousData, normalSample } from "./stats";

export default function simulateLevy({ alpha, gamma, N }) {
  const rawData = Array.from({ length: N }, () => {
    const u = Math.PI * (Math.random() - 0.5);
    const v = -Math.log(Math.random());
    const t = gamma / Math.pow(Math.cos(u / alpha), 1 / alpha);
    return (t * Math.sin(alpha * u)) / Math.pow(v, (1 - alpha) / alpha);
  });

  return processContinuousData(rawData, `Lévy (α=${alpha}, γ=${gamma})`);
}
