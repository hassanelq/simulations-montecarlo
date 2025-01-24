import { mean, standardDeviation, median } from "./stats";

export default function simulateBinomial({ n, p, N }) {
  const rawData = Array.from({ length: N }, () =>
    Array.from({ length: n }, () => (Math.random() < p ? 1 : 0)).reduce(
      (a, b) => a + b,
      0
    )
  );

  const frequencies = rawData.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(frequencies).sort((a, b) => a - b);
  const dataFrequencies = labels.map((key) => frequencies[key]);

  return {
    description: `Binomial Distribution (n=${n}, p=${p})`,
    statistics: {
      Mean: mean(rawData).toFixed(4),
      "Standard Deviation": standardDeviation(rawData).toFixed(4),
      Median: median(rawData).toFixed(4),
      Max: Math.max(...rawData).toFixed(4),
      Min: Math.min(...rawData).toFixed(4),
    },
    data: { labels, frequencies: dataFrequencies },
  };
}
