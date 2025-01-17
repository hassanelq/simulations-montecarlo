export default function simulate1DBrownianMotion({
  steps,
  particles,
  timeStep,
}) {
  const trajectories = Array.from({ length: particles }, () => [0]); // Start at 0 for each particle

  for (let particle = 0; particle < particles; particle++) {
    for (let step = 1; step <= steps; step++) {
      const lastPosition = trajectories[particle][step - 1];
      const randomStep = Math.sqrt(timeStep) * (Math.random() * 2 - 1); // Gaussian step
      trajectories[particle].push(lastPosition + randomStep);
    }
  }

  return trajectories;
}
