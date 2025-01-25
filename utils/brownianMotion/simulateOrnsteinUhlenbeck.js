function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Ornstein-Uhlenbeck process simulation.
 * @param {Object} inputs
 * @param {number} inputs.steps
 * @param {number} inputs.particles
 * @param {number} inputs.timeStep
 * @param {number} inputs.theta - Speed of reversion
 * @param {number} inputs.mean - Long-term mean
 * @param {number} inputs.volatility
 * @returns {Array<Array<number>>}
 */
export default function simulateOrnsteinUhlenbeck({
  steps,
  particles,
  timeStep,
  theta,
  mean,
  volatility,
}) {
  const trajectories = [];

  for (let p = 0; p < particles; p++) {
    // Start from 0 or any initial X
    let x = 0;
    const singleTrajectory = [x];

    for (let i = 1; i <= steps; i++) {
      const z = randomNormal();
      // OU update:
      // X_{t+dt} = X_t + theta*(mean - X_t)*dt + sigma * sqrt(dt)*z
      x =
        x +
        theta * (mean - x) * timeStep +
        volatility * Math.sqrt(timeStep) * z;

      singleTrajectory.push(x);
    }

    trajectories.push(singleTrajectory);
  }

  return trajectories;
}
