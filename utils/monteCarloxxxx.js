/**
 * Helper function to calculate the median
 * @param {Array} array
 * @returns {number} Median of the array
 */
function median(array) {
  const sorted = array.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export function monteCarloInvestment(inputs) {
  const {
    initialInvestment,
    annualReturn,
    annualVolatility,
    timeHorizon,
    numSimulations,
    annualContribution,
    withdrawalRate,
    investmentGoal,
  } = inputs;

  const trajectories = [];
  const finalValues = [];
  const dt = 1; // Annual time step

  for (let i = 0; i < numSimulations; i++) {
    let portfolio = initialInvestment;
    const trajectory = [portfolio];

    for (let year = 1; year <= timeHorizon; year++) {
      const annualReturnShock =
        Math.random() * annualVolatility - annualVolatility / 2;
      portfolio *= 1 + (annualReturn + annualReturnShock) / 100;
      portfolio += annualContribution;
      portfolio -= portfolio * (withdrawalRate / 100);
      trajectory.push(portfolio);
    }

    trajectories.push(trajectory);
    finalValues.push(portfolio);
  }

  finalValues.sort((a, b) => a - b);

  return {
    summary: {
      "Average Final Value": mean(finalValues).toFixed(2),
      "Probability to Goal": (
        (finalValues.filter((v) => v >= investmentGoal).length /
          numSimulations) *
        100
      ).toFixed(2),
    },
    graph: {
      labels: Array.from({ length: timeHorizon + 1 }, (_, i) => i),
      datasets: trajectories.slice(0, 10).map((trajectory, index) => ({
        label: `Simulation ${index + 1}`,
        data: trajectory,
        borderColor: `rgba(0, 123, 255, ${0.1 + 0.9 * (index / 10)})`,
        fill: false,
      })),
    },

    distribution: {
      values: finalValues,
    },
  };
}

export function monteCarloOption(inputs) {
  const {
    stockPrice,
    strikePrice,
    riskFreeRate,
    volatility,
    timeToMaturity,
    numSimulations,
  } = inputs;

  const optionPayoffs = [];
  const trajectories = [];
  const dt = timeToMaturity; // Single step to maturity

  for (let i = 0; i < numSimulations; i++) {
    const path = [];
    const endStockPrice =
      stockPrice *
      Math.exp(
        (riskFreeRate / 100 - 0.5 * (volatility / 100) ** 2) * dt +
          (volatility / 100) * Math.sqrt(dt) * (Math.random() - 0.5)
      );
    optionPayoffs.push(Math.max(endStockPrice - strikePrice, 0));
    path.push(endStockPrice);
    trajectories.push(path);
  }

  const optionPrice = (
    mean(optionPayoffs) * Math.exp((-riskFreeRate / 100) * timeToMaturity)
  ).toFixed(2);

  return {
    summary: {
      "Option Price": optionPrice,
    },
    graph: {
      labels: ["Start", "End"],
      datasets: trajectories.slice(0, 10).map((trajectory, index) => ({
        label: `Simulation ${index + 1}`,
        data: trajectory,
        borderColor: `rgba(54, 162, 235, ${0.1 + 0.9 * (index / 10)})`,
        fill: false,
      })),
    },
  };
}

export function monteCarloCashFlow(inputs) {
  const {
    annualRevenue,
    annualCost,
    revenueVolatility,
    costVolatility,
    timeHorizon,
    numSimulations,
  } = inputs;

  const finalCashFlows = [];
  const trajectories = [];

  for (let i = 0; i < numSimulations; i++) {
    let cashFlow = 0;
    const trajectory = [];

    for (let year = 1; year <= timeHorizon; year++) {
      const revenueShock =
        Math.random() * revenueVolatility - revenueVolatility / 2;
      const costShock = Math.random() * costVolatility - costVolatility / 2;

      const revenue = annualRevenue * (1 + revenueShock / 100);
      const cost = annualCost * (1 + costShock / 100);

      cashFlow += revenue - cost;
      trajectory.push(cashFlow);
    }

    finalCashFlows.push(cashFlow);
    trajectories.push(trajectory);
  }

  finalCashFlows.sort((a, b) => a - b);

  return {
    summary: {
      "Mean Cash Flow": mean(finalCashFlows).toFixed(2),
      "Flux de trésorerie moyen après": `${timeHorizon} ans : ${mean(
        finalCashFlows
      ).toFixed(2)} €`,
    },
    graph: {
      labels: Array.from({ length: timeHorizon }, (_, i) => i + 1),
      datasets: trajectories.slice(0, 10).map((trajectory, index) => ({
        label: `Simulation ${index + 1}`,
        data: trajectory,
        borderColor: `rgba(255, 99, 132, ${0.1 + 0.9 * (index / 10)})`,
        fill: false,
      })),
    },
    distribution: {
      type: "histogram",
      values: finalCashFlows,
    },
  };
}
