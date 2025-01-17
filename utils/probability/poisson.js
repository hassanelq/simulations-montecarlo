export default function simulatePoisson({ lambda, N }) {
  const data = Array.from({ length: N }, () => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    while (p > L) {
      k++;
      p *= Math.random();
    }
    return k - 1;
  });
  return {
    description: `Poisson Distribution (λ=${lambda})`,
    data,
  };
}
