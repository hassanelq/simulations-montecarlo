export default function simulateUniform({ a, b, N }) {
  const data = Array.from({ length: N }, () => Math.random() * (b - a) + a);
  return {
    description: `Uniform Distribution (a=${a}, b=${b})`,
    data,
  };
}
