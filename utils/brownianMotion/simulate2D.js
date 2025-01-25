function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Simulates 2D Brownian Motion.
 * @param {Object} inputs
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @returns {Array<Array<{ x: number, y: number }>>}
 */
export default function simulate2DBrownianMotion({
  steps,
  particles,
  timeStep,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    let x = 0;
    let y = 0;
    const singleTrajectory = [{ x, y }];

    for (let i = 1; i <= steps; i++) {
      const incrementX = Math.sqrt(timeStep) * randomNormal();
      const incrementY = Math.sqrt(timeStep) * randomNormal();
      x += incrementX;
      y += incrementY;
      singleTrajectory.push({ x, y });
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
