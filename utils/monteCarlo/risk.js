function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloRisk(inputs) {
  const {
    portfolioValue,
    expectedReturn,
    volatility,
    timeHorizon,
    numSimulations = 1000,
  } = inputs;

  const losses = [];

  for (let i = 0; i < numSimulations; i++) {
    const randomShock = (Math.random() - 0.5) * volatility;
    const endingValue =
      portfolioValue *
      Math.exp(
        (expectedReturn / 100 - 0.5 * (volatility / 100) ** 2) * timeHorizon +
          randomShock
      );
    const loss = portfolioValue - endingValue;
    losses.push(loss);
  }

  losses.sort((a, b) => a - b);

  const var95 = losses[Math.floor(0.05 * losses.length)];
  const var99 = losses[Math.floor(0.01 * losses.length)];

  return {
    summary: {
      "Mean Loss": mean(losses).toFixed(2),
      "VaR 95%": var95.toFixed(2),
      "VaR 99%": var99.toFixed(2),
    },
    distribution: losses,
  };
}
