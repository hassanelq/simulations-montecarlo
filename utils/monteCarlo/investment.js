function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloInvestment(inputs) {
  const {
    initialInvestment,
    annualReturn,
    annualVolatility,
    timeHorizon,
    annualContribution,
  } = inputs;

  const trajectories = [];
  const finalValues = [];

  for (let i = 0; i < 1000; i++) {
    let portfolio = initialInvestment;
    const trajectory = [portfolio];

    for (let year = 1; year <= timeHorizon; year++) {
      const randomShock = (Math.random() - 0.5) * (annualVolatility / 100); // Adjusted random shock
      portfolio *= 1 + (annualReturn / 100 + randomShock);
      portfolio += annualContribution;
      trajectory.push(portfolio);
    }

    trajectories.push(trajectory);
    finalValues.push(portfolio);
  }

  return {
    graph: {
      labels: Array.from({ length: timeHorizon + 1 }, (_, i) => i),
      datasets: trajectories.slice(0, 10).map((data, idx) => ({
        label: `Simulation ${idx + 1}`,
        data,
        borderColor: `rgba(0, 123, 255, ${0.5 + idx / 20})`,
        fill: false,
      })),
    },
    distribution: finalValues,
    summary: {
      "Average Final Value": mean(finalValues).toFixed(2),
      "Min Final Value": Math.min(...finalValues).toFixed(2),
      "Max Final Value": Math.max(...finalValues).toFixed(2),
    },
  };
}
