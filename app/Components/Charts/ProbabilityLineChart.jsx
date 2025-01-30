// Update ProbabilityLineChart.js
const ProbabilityLineChart = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Density",
        data,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Density: ${context.parsed.y.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Value" },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Probability Density" },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
