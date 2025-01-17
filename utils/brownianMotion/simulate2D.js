export default function simulate2DBrownianMotion({
  steps,
  particles,
  timeStep,
}) {
  const trajectories = Array.from({ length: particles }, () => [
    { x: 0, y: 0 },
  ]);

  for (let particle = 0; particle < particles; particle++) {
    for (let step = 1; step <= steps; step++) {
      const lastPosition = trajectories[particle][step - 1];
      const randomStepX = Math.sqrt(timeStep) * (Math.random() * 2 - 1);
      const randomStepY = Math.sqrt(timeStep) * (Math.random() * 2 - 1);

      trajectories[particle].push({
        x: lastPosition.x + randomStepX,
        y: lastPosition.y + randomStepY,
      });
    }
  }

  return trajectories;
}
