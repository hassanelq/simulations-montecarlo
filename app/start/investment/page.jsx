"use client";

import React, { useState, useCallback } from "react";
import LineChart from "../../Components/Charts/MCLineChart";
import BarChart from "../../Components/Charts/MCBarChart";
import LoadingDots from "../../Components/ui/LoadingDots";
import monteCarloInvestment from "../../../utils/monteCarlo/investment";

const InvestmentPage = () => {
  const [inputs, setInputs] = useState({
    initialInvestment: 10000,
    annualReturn: 5,
    annualVolatility: 15,
    timeHorizon: 15,
    annualContribution: 500,
    investmentGoal: 50000,
    numSimulations: 1000,
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputLabels = {
    initialInvestment: "Initial Investment ($)",
    annualReturn: "Expected Annual Return (%)",
    annualVolatility: "Annual Volatility (%)",
    timeHorizon: "Investment Horizon (Years)",
    annualContribution: "Annual Contribution ($)",
    investmentGoal: "Target Goal ($)",
    numSimulations: "Number of Simulations",
  };

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const simulationResults = monteCarloInvestment(inputs);
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  }, [inputs]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">Investment Simulation</h1>
        <p className="text-gray-600 mb-6">
          Simulate long-term investment outcomes with market volatility
          analysis. Visualize potential portfolio growth and probability of
          reaching your financial goals.
        </p>
      </div>

      {/* Simulation Interface */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Inputs Section */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Investment Parameters</h3>
          {Object.entries(inputLabels).map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="block font-medium">{label}</label>
              <input
                type="number"
                value={inputs[key] || 0}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    [key]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
          <button
            onClick={runSimulation}
            disabled={isLoading}
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isLoading ? <LoadingDots color="white" /> : "Run Simulation"}
          </button>
        </div>

        {/* Results Section */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Simulation Results</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingDots color="#3498db" />
            </div>
          ) : results ? (
            <>
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Success Probability</p>
                    <p className="text-2xl font-bold">
                      {results.summary["Probability to Reach Target"]}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Average Value</p>
                    <p className="text-2xl font-bold">
                      ${results.summary["Average Final Value"]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className=" ">
                  <h5 className="text-lg font-semibold mb-4">
                    Portfolio Growth Paths
                  </h5>
                  <LineChart data={results.graph} />
                </div>

                <div className=" ">
                  <h5 className="text-lg font-semibold mb-4">
                    Outcome Distribution
                  </h5>
                  <BarChart data={results.distribution} />
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Run the simulation to view projected investment outcomes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
