function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Example Stock Price Simulation (Geometric Brownian).
 * @param {Object} inputs
 * @param {number} inputs.initialPrice
 * @param {number} inputs.drift
 * @param {number} inputs.volatility
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @returns {Array<Array<number>>}
 */
export default function simulateStockPrice({
  initialPrice = 100,
  drift = 0.05,
  volatility = 0.2,
  steps = 100,
  particles = 1,
  timeStep = 1,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let price = initialPrice;
    const singleTrajectory = [price];

    for (let i = 1; i <= steps; i++) {
      const z = randomNormal();
      const growth = (drift - 0.5 * volatility * volatility) * timeStep;
      const shock = volatility * Math.sqrt(timeStep) * z;
      price *= Math.exp(growth + shock);
      singleTrajectory.push(price);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
