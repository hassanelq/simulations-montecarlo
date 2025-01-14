"use client";

import React, { useState, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Button from "../../Components/ui/button";
import LoadingDots from "../../Components/ui/LoadingDots";
import { runMonteCarloSimulation } from "../../../utils/monteCarlo";

export default function MonteCarloPage() {
  const [simulationType, setSimulationType] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulationTypeChange = (type) => {
    setSimulationType(type);
    setInputs(getDefaultInputs(type));
    setResults(null);
  };

  const getDefaultInputs = (type) => {
    switch (type) {
      case "investment":
        return {
          initialInvestment: 10000,
          annualReturn: 5,
          annualVolatility: 15,
          timeHorizon: 30,
          numSimulations: 1000,
          annualContribution: 1000,
          annualWithdrawalRate: 4,
          investmentGoal: 50000,
        };
      case "options":
        return {
          stockPrice: 100,
          strikePrice: 100,
          timeToMaturity: 1,
          riskFreeRate: 2,
          volatility: 20,
          numSimulations: 1000,
        };
      case "cashflow":
        return {
          initialCashflow: 10000,
          annualGrowthRate: 5,
          annualVolatility: 10,
          timeHorizon: 10,
          numSimulations: 1000,
        };
      default:
        return {};
    }
  };

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const simulations = runMonteCarloSimulation({ simulationType, inputs });
      setResults(simulations);
      setIsLoading(false);
    }, 1000);
  }, [simulationType, inputs]);

  const getChartData = () => {
    if (!results) return null;
    return {
      labels: Array.from({ length: inputs.timeHorizon + 1 }, (_, i) => i),
      datasets: results.trajectories.slice(0, 10).map((trajectory, index) => ({
        label: `Simulation ${index + 1}`,
        data: trajectory,
        borderColor: `rgba(0, 123, 255, 0.${index + 2})`,
        fill: false,
      })),
    };
  };

  return (
    <div className="h-fit px-4 lg:px-10 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Explanation Section */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">Monte Carlo Simulation</h1>
        <p className="text-gray-600">
          Monte Carlo simulations allow you to explore a range of outcomes for
          different scenarios. Choose a simulation type to get started.
        </p>
      </div>

      {/* Simulation Types */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Choose a Simulation Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Simulation d'Investissement",
              description:
                "Model future portfolio performance with random returns under market scenarios.",
              type: "investment",
            },
            {
              title: "Simulation des Prix d’Options",
              description:
                "Analyze option pricing based on volatility and underlying asset movements.",
              type: "options",
            },
            {
              title: "Simulation des Flux de Trésorerie",
              description:
                "Forecast cash flow growth and variability for financial planning.",
              type: "cashflow",
            },
          ].map((sim, index) => (
            <div
              key={index}
              onClick={() => handleSimulationTypeChange(sim.type)}
              className={`cursor-pointer p-6 rounded-lg shadow-md transition transform hover:scale-105 ${
                simulationType === sim.type
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {sim.title}
              </h3>
              <p className="text-gray-600">{sim.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs and Results */}
      {simulationType && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inputs Section */}
          <div className="md:w-1/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Input Parameters</h3>
            <div className="space-y-4">
              {Object.keys(inputs).map((key) => (
                <div key={key}>
                  <label className="block mb-1 font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={inputs[key]}
                    onChange={(e) =>
                      handleInputChange(key, Number(e.target.value))
                    }
                  />
                </div>
              ))}
              <Button
                onClick={runSimulation}
                disabled={isLoading}
                className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isLoading ? <LoadingDots color="white" /> : "Simulate"}
              </Button>
            </div>
          </div>

          {/* Simulation Results Section */}
          <div className="md:w-2/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Simulation Results</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingDots color="#3498db" />
              </div>
            ) : results ? (
              <>
                <h4 className="text-lg font-semibold mb-2">Summary</h4>
                <ul className="text-gray-700 mb-4">
                  <li>Average Final Value: {results.averageFinalValue} €</li>
                  <li>Median Final Value: {results.medianFinalValue} €</li>
                  <li>5th Percentile: {results.percentile5} €</li>
                  <li>95th Percentile: {results.percentile95} €</li>
                </ul>
                <h4 className="text-lg font-semibold mb-2">
                  Portfolio Trajectories
                </h4>
                <Line data={getChartData()} />
              </>
            ) : (
              <p className="text-gray-500">
                Run a simulation to see the results.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
