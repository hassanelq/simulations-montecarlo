// Box-Muller transform to generate a standard normal random variable
function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Simulates 1D Brownian Motion (Wiener process).
 * @param {Object} inputs
 * @param {number} inputs.steps - Number of time steps
 * @param {number} inputs.particles - Number of paths to simulate
 * @param {number} inputs.timeStep - Size of each time increment (e.g. 1)
 * @returns {Array<Array<number>>} Array of trajectories, each trajectory is an array of positions
 */
export default function simulate1DBrownianMotion({
  steps,
  particles,
  timeStep,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let position = 0;
    const singleTrajectory = [position];

    for (let i = 1; i <= steps; i++) {
      // Brownian increment ~ sqrt(dt) * N(0,1)
      const increment = Math.sqrt(timeStep) * randomNormal();
      position += increment;
      singleTrajectory.push(position);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
