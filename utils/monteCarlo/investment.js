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
    investmentGoal,
    numSimulations,
  } = inputs;

  const trajectories = [];
  const finalValues = [];

  for (let i = 0; i < numSimulations; i++) {
    let portfolio = initialInvestment;
    const trajectory = [portfolio];

    for (let year = 1; year <= timeHorizon; year++) {
      const randomShock = (Math.random() - 0.5) * annualVolatility;
      portfolio *= 1 + (annualReturn + randomShock) / 100;
      portfolio += annualContribution;
      trajectory.push(portfolio);
    }

    trajectories.push(trajectory);
    finalValues.push(portfolio);
  }

  const probabilityToReachGoal =
    (finalValues.filter((value) => value >= investmentGoal).length /
      numSimulations) *
    100;

  return {
    summary: {
      "Average Final Value": mean(finalValues).toFixed(2),
      "Probability to Reach Target": `${probabilityToReachGoal.toFixed(2)}%`,
    },
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
  };
}
