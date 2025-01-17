"use client";

import React, { useState, useCallback } from "react";
import { Line } from "react-chartjs-2";

import "chart.js/auto";
import Button from "../../Components/ui/button";
import LoadingDots from "../../Components/ui/LoadingDots";
import {
  monteCarloInvestment,
  monteCarloOption,
  monteCarloCashFlow,
} from "../../../utils/monteCarlo";
import DistributionBars from "../../../utils/Distribution";

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
          annualReturn: 7,
          annualVolatility: 15,
          timeHorizon: 30,
          numSimulations: 1000,
          annualContribution: 1000,
          withdrawalRate: 0,
          investmentGoal: 50000,
        };
      case "options":
        return {
          stockPrice: 100,
          strikePrice: 110,
          riskFreeRate: 5,
          volatility: 20,
          timeToMaturity: 1,
          numSimulations: 1000,
        };
      case "cashflow":
        return {
          annualRevenue: 100000,
          annualCost: 80000,
          revenueVolatility: 10,
          costVolatility: 5,
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
      let simulationResults;
      if (simulationType === "investment") {
        simulationResults = monteCarloInvestment(inputs);
      } else if (simulationType === "options") {
        simulationResults = monteCarloOption(inputs);
      } else if (simulationType === "cashflow") {
        simulationResults = monteCarloCashFlow(inputs);
      }
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  }, [simulationType, inputs]);

  return (
    <div className="min-h-[85vh] px-4 lg:px-10 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Explanation Section */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">Monte Carlo Simulation</h1>
        <p className="text-gray-600">
          Monte Carlo simulations are used to predict outcomes in uncertain
          scenarios. Choose a simulation type and configure parameters to
          analyze results.
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
                "Evaluate future portfolio performance under random market scenarios.",
              type: "investment",
            },
            {
              title: "Simulation des Prix d’Options",
              description:
                "Analyze option pricing based on asset trajectories.",
              type: "options",
            },
            {
              title: "Simulation des Flux de Trésorerie",
              description:
                "Predict financial project viability by modeling revenue and cost uncertainty.",
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
                  {Object.entries(results.summary).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>

                {simulationType === "investment" && (
                  <>
                    <DistributionBars
                      values={results.distribution.values}
                      label="Distribution des Valeurs Finales de l'Investissement"
                    />
                    <div className="mt-6">
                      <Line data={results.graph} />
                    </div>
                  </>
                )}
                {simulationType === "options" && results.graph && (
                  <div className="mt-6"></div>
                )}
                {simulationType === "cashflow" && (
                  <DistributionBars
                    values={results.distribution.values}
                    label="Distribution des Flux de Trésorerie"
                  />
                )}
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
