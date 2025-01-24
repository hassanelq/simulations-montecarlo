import { mean, median } from "./stats";

export default function simulatePoisson({ lambda, N }) {
  const rawData = Array.from({ length: N }, () => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    while (p > L) {
      k++;
      p *= Math.random();
    }
    return k - 1;
  });

  const frequencies = rawData.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(frequencies).sort((a, b) => a - b);
  const dataFrequencies = labels.map((key) => frequencies[key]);

  return {
    description: `Poisson Distribution (λ=${lambda})`,
    statistics: {
      Mean: mean(rawData).toFixed(4),
      Median: median(rawData).toFixed(4),
      Max: Math.max(...rawData).toFixed(4),
      Min: Math.min(...rawData).toFixed(4),
    },
    data: { labels, frequencies: dataFrequencies },
  };
}
