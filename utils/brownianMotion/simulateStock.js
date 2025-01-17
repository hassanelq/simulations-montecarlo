export default function simulateStockPrice({
  initialPrice,
  drift,
  volatility,
  steps,
  particles,
  timeStep,
}) {
  const trajectories = Array.from({ length: particles }, () => [initialPrice]);

  for (let particle = 0; particle < particles; particle++) {
    for (let step = 1; step <= steps; step++) {
      const lastPrice = trajectories[particle][step - 1];
      const randomStep =
        drift * timeStep +
        volatility * Math.sqrt(timeStep) * (Math.random() * 2 - 1);

      trajectories[particle].push(lastPrice * Math.exp(randomStep));
    }
  }

  return trajectories;
}
