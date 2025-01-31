import { processDiscreteData } from "./stats";

export default function simulateHypergeometric({ K, N, n, simulations }) {
  const rawData = Array.from({ length: simulations }, () => {
    let successes = 0;
    const population = Array.from({ length: N }, (_, i) => (i < K ? 1 : 0));

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * population.length);
      successes += population.splice(idx, 1)[0];
    }
    return successes;
  });

  return processDiscreteData(
    rawData,
    `Hypergeometric (K=${K}, N=${N}, n=${n})`
  );
}
