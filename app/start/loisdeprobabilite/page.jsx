"use client";

import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Button from "../../Components/ui/button";
import LoadingDots from "../../Components/ui/LoadingDots";

export default function ProbabilityDistributionsPage() {
  const [distributionType, setDistributionType] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const distributions = [
    { type: "normal", name: "Normale" },
    { type: "uniform", name: "Uniforme" },
    { type: "exponential", name: "Exponentielle" },
    { type: "poisson", name: "Poisson" },
    { type: "binomial", name: "Binomiale" },
  ];

  const defaultInputs = {
    normal: { mu: 0, sigma: 1, N: 1000 },
    uniform: { a: 0, b: 1, N: 1000 },
    exponential: { lambda: 1, N: 1000 },
    poisson: { lambda: 1, N: 1000 },
    binomial: { n: 10, p: 0.5, N: 1000 },
  };

  const handleDistributionChange = (type) => {
    setDistributionType(type);
    setInputs(defaultInputs[type]);
    setResults(null);
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const simulateDistribution = () => {
    setIsLoading(true);
    setTimeout(() => {
      let simulationResults;

      if (distributionType === "normal") {
        const { mu, sigma, N } = inputs;
        const data = Array.from(
          { length: N },
          () => Math.random() * sigma + mu
        );
        simulationResults = {
          data,
          description: `Simulation de la Loi Normale (μ=${mu}, σ=${sigma})`,
        };
      } else if (distributionType === "uniform") {
        const { a, b, N } = inputs;
        const data = Array.from(
          { length: N },
          () => Math.random() * (b - a) + a
        );
        simulationResults = {
          data,
          description: `Simulation de la Loi Uniforme (a=${a}, b=${b})`,
        };
      } else if (distributionType === "exponential") {
        const { lambda, N } = inputs;
        const data = Array.from(
          { length: N },
          () => -Math.log(1 - Math.random()) / lambda
        );
        simulationResults = {
          data,
          description: `Simulation de la Loi Exponentielle (λ=${lambda})`,
        };
      } else if (distributionType === "poisson") {
        const { lambda, N } = inputs;
        const data = Array.from({ length: N }, () => {
          let L = Math.exp(-lambda);
          let k = 0;
          let p = 1;
          while (p > L) {
            k++;
            p *= Math.random();
          }
          return k - 1;
        });
        simulationResults = {
          data,
          description: `Simulation de la Loi de Poisson (λ=${lambda})`,
        };
      } else if (distributionType === "binomial") {
        const { n, p, N } = inputs;
        const data = Array.from({ length: N }, () =>
          Array.from({ length: n }, () => (Math.random() < p ? 1 : 0)).reduce(
            (a, b) => a + b,
            0
          )
        );
        simulationResults = {
          data,
          description: `Simulation de la Loi Binomiale (n=${n}, p=${p})`,
        };
      }

      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-fit px-4 lg:px-10 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Explanation Section */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Simulation des Lois de Probabilité
        </h1>
        <p className="text-gray-600">
          Simulez et visualisez différentes lois de probabilité.
        </p>
      </div>

      {/* Distribution Types */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">
          Choisir une Loi de Probabilité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {distributions.map((dist) => (
            <div
              key={dist.type}
              onClick={() => handleDistributionChange(dist.type)}
              className={`cursor-pointer p-6 rounded-lg shadow-md transition ${
                distributionType === dist.type
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {dist.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs and Results */}
      {distributionType && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inputs Section */}
          <div className="md:w-1/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Paramètres d'Entrée</h3>
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key}>
                  <label className="block mb-1 font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={value}
                    onChange={(e) =>
                      handleInputChange(key, parseFloat(e.target.value))
                    }
                  />
                </div>
              ))}
              <Button
                onClick={simulateDistribution}
                disabled={isLoading}
                className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isLoading ? <LoadingDots color="white" /> : "Simuler"}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:w-2/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Résultats</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingDots color="#3498db" />
              </div>
            ) : results ? (
              <>
                <h4 className="text-lg font-semibold mb-4">
                  {results.description}
                </h4>
                <Bar
                  data={{
                    labels: results.data,
                    datasets: [
                      {
                        label: results.description,
                        data: results.data,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </>
            ) : (
              <p className="text-gray-500">
                Lancez une simulation pour voir les résultats.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
