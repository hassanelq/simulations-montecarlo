function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Brownian motion with drift.
 * @param {Object} inputs
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @param {number} inputs.drift - e.g. 0.05
 * @param {number} inputs.volatility - e.g. 0.2
 * @returns {Array<Array<number>>}
 */
export default function simulateWithDrift({
  steps,
  particles,
  timeStep,
  drift,
  volatility,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let position = 0;
    const singleTrajectory = [position];

    for (let i = 1; i <= steps; i++) {
      // Scale drift properly based on time step
      const scaledDrift = drift * (timeStep / steps);
      const increment =
        scaledDrift + volatility * Math.sqrt(timeStep) * randomNormal();
      position += increment;
      singleTrajectory.push(position);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
