function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function monteCarloOptions(inputs) {
  const { stockPrice, strikePrice, riskFreeRate, volatility, timeToMaturity } =
    inputs;

  const optionPayoffs = [];
  const trajectories = [];
  const dt = timeToMaturity;

  for (let i = 0; i < 1000; i++) {
    const randomShock = (Math.random() - 0.5) * volatility;
    const endStockPrice =
      stockPrice *
      Math.exp(
        (riskFreeRate / 100 - 0.5 * (volatility / 100) ** 2) * dt +
          (volatility / 100) * Math.sqrt(dt) * randomShock
      );
    optionPayoffs.push(Math.max(endStockPrice - strikePrice, 0));
    trajectories.push([stockPrice, endStockPrice]);
  }

  const optionPrice = (
    mean(optionPayoffs) * Math.exp((-riskFreeRate / 100) * timeToMaturity)
  ).toFixed(2);

  return {
    summary: { "Option Price": optionPrice },
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
