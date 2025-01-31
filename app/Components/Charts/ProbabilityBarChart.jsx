"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const ProbabilityBarChart = ({
  data,
  labels,
  distributionType,
  params,
  isDiscrete = false,
}) => {
  const chartRef = useRef(null);

  // Register Chart.js and plugins on the client side
  useEffect(() => {
    import("chart.js").then(({ Chart: ChartJS }) => {
      import("chartjs-plugin-zoom").then((zoomPlugin) => {
        import("chartjs-plugin-annotation").then((annotationPlugin) => {
          ChartJS.register(
            ...ChartJS.registerables,
            zoomPlugin.default,
            annotationPlugin.default
          );
        });
      });
    });
  }, []);

  // Color scheme based on distribution type
  const colorMap = {
    normal: { bg: "rgba(54, 162, 235, 0.5)", border: "rgba(54, 162, 235, 1)" },
    lognormal: {
      bg: "rgba(255, 99, 132, 0.5)",
      border: "rgba(255, 99, 132, 1)",
    },
    studentt: {
      bg: "rgba(75, 192, 192, 0.5)",
      border: "rgba(75, 192, 192, 1)",
    },
    cauchy: {
      bg: "rgba(153, 102, 255, 0.5)",
      border: "rgba(153, 102, 255, 1)",
    },
    default: { bg: "rgba(255, 159, 64, 0.5)", border: "rgba(255, 159, 64, 1)" },
  };

  const { bg, border } = colorMap[distributionType] || colorMap.default;

  // Theoretical PDF calculation
  const theoreticalPDF = labels.map((label) => {
    const x = parseFloat(label);
    switch (distributionType) {
      case "normal":
        return (
          (1 / (params.sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((x - params.mu) / params.sigma) ** 2)
        );
      case "lognormal":
        return (
          (1 / (x * params.sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((Math.log(x) - params.mu) / params.sigma) ** 2)
        );
      default:
        return null;
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: isDiscrete ? "Probability Mass" : "Frequency Density",
        data,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
        barPercentage: isDiscrete ? 0.9 : 1.0,
        categoryPercentage: isDiscrete ? 0.8 : 1.0,
      },
      ...(theoreticalPDF[0]
        ? [
            {
              label: "Theoretical PDF",
              data: theoreticalPDF,
              type: "line",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.1,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${distributionType} Distribution` },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            if (context.datasetIndex === 0) {
              return `${label}: ${context.parsed.y.toFixed(2)}`;
            }
            return `${label}: ${context.parsed.y.toExponential(2)}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
      annotation: {
        annotations: {
          meanLine: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgba(0, 0, 0, 0.7)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Mean",
              position: "end",
            },
          },
        },
      },
      id: "distributionChart",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isDiscrete ? "Outcome" : "Value Range",
        },
        type: isDiscrete ? "category" : "linear",
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: isDiscrete ? "Probability" : "Density",
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
  };

  const handleResetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  return (
    <div className="w-full h-[32rem] relative">
      <Bar
        ref={chartRef}
        data={chartData}
        options={options}
        datasetIdKey="distributionChart"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className="px-2 py-1 bg-white shadow rounded text-sm"
          onClick={handleResetZoom}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};

export default ProbabilityBarChart;
