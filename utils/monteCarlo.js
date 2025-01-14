export function runMonteCarloSimulation({ simulationType, inputs }) {
  const { numSimulations, timeHorizon } = inputs;
  const results = {
    trajectories: [],
    averageFinalValue: 0,
    medianFinalValue: 0,
    percentile5: 0,
    percentile95: 0,
  };

  for (let i = 0; i < numSimulations; i++) {
    const trajectory = [];
    let currentValue = inputs.initialInvestment || inputs.stockPrice;

    for (let t = 0; t <= timeHorizon; t++) {
      const randomShock =
        inputs.annualVolatility *
        Math.sqrt(1 / timeHorizon) *
        (Math.random() - 0.5);
      const drift = (inputs.annualReturn || inputs.riskFreeRate) / timeHorizon;
      currentValue *= Math.exp(drift + randomShock);
      trajectory.push(currentValue);
    }

    results.trajectories.push(trajectory);
  }

  // Aggregate results (e.g., mean, percentiles)
  const finalValues = results.trajectories.map((t) => t[t.length - 1]);
  finalValues.sort((a, b) => a - b);

  results.averageFinalValue = (
    finalValues.reduce((a, b) => a + b, 0) / numSimulations
  ).toFixed(2);
  results.medianFinalValue = (
    finalValues[Math.floor(numSimulations / 2)] || 0
  ).toFixed(2);
  results.percentile5 = (
    finalValues[Math.floor(0.05 * numSimulations)] || 0
  ).toFixed(2);
  results.percentile95 = (
    finalValues[Math.floor(0.95 * numSimulations)] || 0
  ).toFixed(2);

  return results;
}
