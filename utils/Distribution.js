import { Bar } from "react-chartjs-2";

const DistributionBars = ({ values, label }) => {
  const data = {
    labels: [...new Set(values.map((v) => Math.floor(v / 10000) * 10000))],
    datasets: [
      {
        label: label,
        data: values.reduce((acc, value) => {
          const rounded = Math.floor(value / 10000) * 10000;
          acc[rounded] = (acc[rounded] || 0) + 1;
          return acc;
        }, {}),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3 className="text-lg font-bold my-4">{label}</h3>
      <Bar
        data={data}
        options={{ responsive: true, maintainAspectRatio: true }}
      />
    </div>
  );
};

export default DistributionBars;
