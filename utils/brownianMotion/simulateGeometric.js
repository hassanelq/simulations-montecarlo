function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Geometric Brownian Motion simulation for multiple paths.
 * @param {Object} inputs
 * @param {number} inputs.initialPrice
 * @param {number} inputs.drift
 * @param {number} inputs.volatility
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @returns {Array<Array<number>>}
 */
export default function simulateGeometricBrownianMotion({
  initialPrice,
  drift,
  volatility,
  steps,
  particles,
  timeStep,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let price = initialPrice;
    const singleTrajectory = [price];

    for (let i = 1; i <= steps; i++) {
      const z = randomNormal();
      // GBM formula:
      const growth = (drift - 0.5 * volatility * volatility) * timeStep;
      const shock = volatility * Math.sqrt(timeStep) * z;
      price = price * Math.exp(growth + shock);
      singleTrajectory.push(price);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
