import { mean, standardDeviation, median, skewness, kurtosis } from "./stats";

export default function simulateNormal({ mu, sigma, N }) {
  // Generate raw data using the normal distribution formula
  const rawData = Array.from(
    { length: N },
    () =>
      mu +
      sigma *
        Math.sqrt(-2 * Math.log(Math.random())) *
        Math.cos(2 * Math.PI * Math.random())
  );

  // Create finer bins for the histogram (e.g., step of 0.1)
  const binWidth = 0.1;
  const minValue = Math.min(...rawData) - binWidth; // Adjust min for a clean range
  const maxValue = Math.max(...rawData) + binWidth; // Adjust max for a clean range
  const bins = Array.from(
    { length: Math.ceil((maxValue - minValue) / binWidth) },
    (_, i) => minValue + i * binWidth
  );

  const frequencies = bins.map((bin, i) => {
    const nextBin = bin + binWidth;
    return rawData.filter((value) => value >= bin && value < nextBin).length;
  });

  return {
    description: `Normal Distribution (μ=${mu}, σ=${sigma})`,
    statistics: {
      "Moyenne des résultats": mean(rawData).toFixed(4),
      "Écart type des résultats": standardDeviation(rawData).toFixed(4),
      "Médiane des résultats": median(rawData).toFixed(4),
      "Maximum des résultats": Math.max(...rawData).toFixed(4),
      "Minimum des résultats": Math.min(...rawData).toFixed(4),
      "Asymétrie (Skewness) des résultats": skewness(rawData).toFixed(4),
      "Kurtosis des résultats": kurtosis(rawData).toFixed(4),
    },
    data: {
      labels: bins.map((bin) => bin.toFixed(1)),
      frequencies,
    },
  };
}
