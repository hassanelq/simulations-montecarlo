import { mean, standardDeviation, median } from "./stats";

export default function simulateUniform({ a, b, N }) {
  const rawData = Array.from({ length: N }, () => Math.random() * (b - a) + a);

  const frequencies = rawData.reduce((acc, value) => {
    const bin = Math.floor(value * 10) / 10;
    acc[bin] = (acc[bin] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(frequencies).sort((a, b) => a - b);
  const dataFrequencies = labels.map((key) => frequencies[key]);

  return {
    description: `Uniform Distribution (a=${a}, b=${b})`,
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
