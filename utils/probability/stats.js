export function mean(data) {
  return data.reduce((sum, value) => sum + value, 0) / data.length;
}

export function standardDeviation(data) {
  const avg = mean(data);
  const variance =
    data.reduce((sum, value) => sum + (value - avg) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}

export function median(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function skewness(data) {
  const avg = mean(data);
  const stddev = standardDeviation(data);
  const n = data.length;
  return (
    (n / ((n - 1) * (n - 2))) *
    data.reduce((sum, value) => sum + ((value - avg) / stddev) ** 3, 0)
  );
}

export function kurtosis(data) {
  const avg = mean(data);
  const stddev = standardDeviation(data);
  const n = data.length;
  return (
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) *
      data.reduce((sum, value) => sum + ((value - avg) / stddev) ** 4, 0) -
    (3 * (n - 1) ** 2) / ((n - 2) * (n - 3))
  );
}
