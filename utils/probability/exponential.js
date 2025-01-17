export default function simulateExponential({ lambda, N }) {
  const data = Array.from(
    { length: N },
    () => -Math.log(1 - Math.random()) / lambda
  );
  return {
    description: `Exponential Distribution (λ=${lambda})`,
    data,
  };
}
