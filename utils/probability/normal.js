export default function simulateNormal({ mu, sigma, N }) {
  const data = Array.from({ length: N }, () => Math.random() * sigma + mu);
  return {
    description: `Normal Distribution (μ=${mu}, σ=${sigma})`,
    data,
  };
}
