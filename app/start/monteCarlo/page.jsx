"use client";

import React, { useState, useCallback } from "react";
import InputsForm from "../../Components/InputsForm";
import LineChart from "../../Components/Charts/LineChart";
import BarChart from "../../Components/Charts/BarChart";
import LoadingDots from "../../Components/ui/LoadingDots";

import monteCarloInvestment from "../../../utils/monteCarlo/investment";
import monteCarloOptions from "../../../utils/monteCarlo/options";
import monteCarloRisk from "../../../utils/monteCarlo/risk";

const MonteCarloPage = () => {
  const [simulationType, setSimulationType] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const simulationTypes = [
    { title: "Investment Simulation", type: "investment" },
    { title: "Options Pricing", type: "options" },
    { title: "Risk Analysis", type: "risk" },
  ];

  const defaultInputs = {
    investment: {
      initialInvestment: 10000,
      annualReturn: 7,
      annualVolatility: 15,
      timeHorizon: 30,
      annualContribution: 1000,
    },
    options: {
      stockPrice: 100,
      strikePrice: 110,
      riskFreeRate: 5,
      volatility: 20,
      timeToMaturity: 1,
    },
    risk: {
      portfolioValue: 100000,
      expectedReturn: 8,
      volatility: 12,
      timeHorizon: 1,
    },
  };

  const handleSimulationTypeChange = (type) => {
    setSimulationType(type);
    setInputs(defaultInputs[type]);
    setResults(null);
  };

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      let simulationResults;
      if (simulationType === "investment") {
        simulationResults = monteCarloInvestment(inputs);
      } else if (simulationType === "options") {
        simulationResults = monteCarloOptions(inputs);
      } else if (simulationType === "risk") {
        simulationResults = monteCarloRisk(inputs);
      }
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  }, [simulationType, inputs]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col gap-10 bg-gray-50">
      {/* Simulation Type Selection */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Monte Carlo Simulations
        </h1>
        <p className="text-gray-600">
          Select a simulation type and customize parameters to analyze outcomes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {simulationTypes.map((sim, index) => (
            <button
              key={index}
              onClick={() => handleSimulationTypeChange(sim.type)}
              className={`p-6 rounded-lg shadow-md text-center transition transform hover:scale-105 ${
                simulationType === sim.type
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-bold">{sim.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs and Results */}
      {simulationType && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inputs Section */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Input Parameters</h3>
            <InputsForm
              inputs={inputs}
              setInputs={setInputs}
              type={simulationType}
            />
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
                <h4 className="text-lg font-semibold mb-4">Summary</h4>
                <ul className="text-gray-700 mb-6">
                  {Object.entries(results.summary || {}).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>: {value}
                    </li>
                  ))}
                </ul>
                {results.graph && <LineChart data={results.graph} />}
                {results.distribution && (
                  <BarChart data={results.distribution} />
                )}
              </>
            ) : (
              <p className="text-gray-500">
                Run the simulation to view results.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonteCarloPage;
