export default function simulateBinomial({ n, p, N }) {
  const data = Array.from({ length: N }, () =>
    Array.from({ length: n }, () => (Math.random() < p ? 1 : 0)).reduce(
      (a, b) => a + b,
      0
    )
  );
  return {
    description: `Binomial Distribution (n=${n}, p=${p})`,
    data,
  };
}
