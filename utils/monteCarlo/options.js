// Utility: Generate a random draw from the standard normal distribution
function randomNormal() {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloOptions(inputs) {
  const {
    stockPrice,
    strikePrice,
    riskFreeRate, // in %
    volatility, // in %
    timeToMaturity, // in years
    numSimulations = 1000,
  } = inputs;

  const optionPayoffs = [];
  const trajectories = [];

  for (let i = 0; i < numSimulations; i++) {
    const z = randomNormal();
    const drift =
      (riskFreeRate / 100 - 0.5 * (volatility / 100) ** 2) * timeToMaturity;
    const shock = (volatility / 100) * Math.sqrt(timeToMaturity) * z;

    const endStockPrice = stockPrice * Math.exp(drift + shock);
    const payoff = Math.max(endStockPrice - strikePrice, 0);

    optionPayoffs.push(payoff);
    // Keep a mini trajectory: start and end
    trajectories.push([stockPrice, endStockPrice]);
  }

  // Discount the mean payoff back to present value
  const avgPayoff = mean(optionPayoffs);
  const discountFactor = Math.exp(-1 * (riskFreeRate / 100) * timeToMaturity);
  const optionPrice = (avgPayoff * discountFactor).toFixed(2);

  return {
    summary: {
      "Option Price": optionPrice,
    },
    graph: {
      labels: ["Start", "End"],
      datasets: trajectories.slice(0, 10).map((data, idx) => ({
        label: `Simulation ${idx + 1}`,
        data,
        borderColor: `rgba(54, 162, 235, ${0.5 + idx / 20})`,
        fill: false,
      })),
    },
  };
}
