import { processContinuousData } from "./stats";

export default function simulateLognormal({ mu, sigma, N }) {
  const rawData = Array.from({ length: N }, () =>
    Math.exp(
      mu +
        sigma *
          Math.sqrt(-2 * Math.log(Math.random())) *
          Math.cos(2 * Math.PI * Math.random())
    )
  );

  return processContinuousData(rawData, `Log-Normal (μ=${mu}, σ=${sigma})`);
}
