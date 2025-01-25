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
 * @param {number} inputs.drift
 * @param {number} inputs.volatility
 * @param {number} inputs.initialValue
 * @returns {Array<Array<number>>}
 */
export default function simulateWithDrift({
  steps,
  particles,
  timeStep,
  drift,
  volatility,
  initialValue,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let position = initialValue;
    const singleTrajectory = [position];

    for (let i = 1; i <= steps; i++) {
      // Euler increment with drift scaled by time step
      const scaledDrift = drift * timeStep;
      const increment =
        scaledDrift + volatility * Math.sqrt(timeStep) * randomNormal();
      position += increment;
      singleTrajectory.push(position);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
