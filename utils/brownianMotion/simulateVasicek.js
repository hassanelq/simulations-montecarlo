function randomNormal() {
  const u1 = 1 - Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * Simulates the Vasicek model for interest rates.
 * @param {Object} inputs
 * @param {number} inputs.steps - Number of steps
 * @param {number} inputs.particles - Number of paths
 * @param {number} inputs.timeStep - Time step size
 * @param {number} inputs.theta - Speed of mean reversion
 * @param {number} inputs.mean - Long-term mean rate
 * @param {number} inputs.volatility - Volatility of rate changes
 * @param {number} inputs.initialRate - Starting interest rate
 * @returns {Array<Array<number>>}
 */
export default function simulateVasicek({
  steps,
  particles,
  timeStep,
  theta,
  mean,
  volatility,
  initialRate,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let rate = initialRate;
    const trajectory = [rate];

    for (let i = 1; i <= steps; i++) {
      const z = randomNormal();
      rate +=
        theta * (mean - rate) * timeStep + volatility * Math.sqrt(timeStep) * z;
      trajectory.push(rate);
    }

    trajectories.push(trajectory);
  }

  return trajectories;
}
