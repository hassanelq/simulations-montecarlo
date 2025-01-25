"use client";

import React, { useState } from "react";
import BrownianLineChart from "../../Components/Charts/BrownianLineChart";
import LoadingDots from "../../Components/ui/LoadingDots";
import simulate1DBrownianMotion from "../../../utils/brownianMotion/simulate1D";
import simulate2DBrownianMotion from "../../../utils/brownianMotion/simulate2D";
import simulateWithDrift from "../../../utils/brownianMotion/simulateWithDrift";
import simulateWithoutDrift from "../../../utils/brownianMotion/simulateWithoutDrift";
import simulateOrnsteinUhlenbeck from "../../../utils/brownianMotion/simulateOrnsteinUhlenbeck";
import simulateStockPrice from "../../../utils/brownianMotion/simulateStock";
import simulateGeometricBrownianMotion from "../../../utils/brownianMotion/simulateGeometric";

const defaultInputs = {
  "1D": { steps: 100, particles: 5, timeStep: 1 },
  "2D": { steps: 100, particles: 5, timeStep: 1 },
  drift: {
    steps: 100,
    particles: 5,
    timeStep: 1,
    drift: 0.05,
    volatility: 0.2,
  },
  noDrift: { steps: 100, particles: 5, timeStep: 1, volatility: 0.2 },
  ornstein: {
    steps: 100,
    particles: 5,
    timeStep: 1,
    theta: 0.7,
    mean: 0.0,
    volatility: 0.2,
  },
  geometric: {
    initialPrice: 100,
    drift: 0.05,
    volatility: 0.2,
    steps: 100,
    particles: 5,
    timeStep: 1,
  },
};

const BrownianMotionPage = () => {
  const [applicationType, setApplicationType] = useState(null);
  const [application, setApplication] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const applicationCategories = {
    standard: [
      { title: "1D Brownian Motion", key: "1D" },
      { title: "2D Brownian Motion", key: "2D" },
      { title: "Brownian Motion with Drift", key: "drift" },
      { title: "Brownian Motion without Drift", key: "noDrift" },
      { title: "Ornstein-Uhlenbeck Process", key: "ornstein" },
      { title: "Geometric Brownian Motion", key: "geometric" },
    ],
    finance: [
      { title: "Stock Price Simulation", key: "stock" },
      { title: "Investment Simulation", key: "investment" },
      { title: "Options Pricing Simulation", key: "options" },
      { title: "Risk Analysis Simulation", key: "risk" },
    ],
  };

  const handleCategoryChange = (type) => {
    setApplicationType(type);
    setApplication(null);
    setInputs({});
    setResults(null);
  };

  const handleApplicationChange = (key) => {
    setApplication(key);
    setInputs(defaultInputs[key]);
    setResults(null);
  };

  const runSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      let simulationResults;
      switch (application) {
        case "1D":
          simulationResults = simulate1DBrownianMotion(inputs);
          break;
        case "2D":
          simulationResults = simulate2DBrownianMotion(inputs);
          break;
        case "drift":
          simulationResults = simulateWithDrift(inputs);
          break;
        case "noDrift":
          simulationResults = simulateWithoutDrift(inputs);
          break;
        case "ornstein":
          simulationResults = simulateOrnsteinUhlenbeck(inputs);
          break;
        case "geometric":
          simulationResults = simulateGeometricBrownianMotion(inputs);
          break;
        case "stock":
          simulationResults = simulateStockPrice(inputs);
          break;
        default:
          simulationResults = null;
      }
      setResults(simulationResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] px-4 lg:px-10 py-10 flex flex-col gap-10 bg-gray-50">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4">
          Brownian Motion Simulator
        </h1>
        <p className="text-gray-600">
          Explore Brownian motion simulations and financial applications.
        </p>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Select a Category</h2>
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleCategoryChange("standard")}
            className={`p-6 rounded-lg shadow-md transition transform hover:scale-105 ${
              applicationType === "standard"
                ? "bg-blue-100 border-blue-500 border-2"
                : "bg-white"
            }`}
          >
            Standard Applications
          </button>
          <button
            onClick={() => handleCategoryChange("finance")}
            className={`p-6 rounded-lg shadow-md transition transform hover:scale-105 ${
              applicationType === "finance"
                ? "bg-blue-100 border-blue-500 border-2"
                : "bg-white"
            }`}
          >
            Financial Applications
          </button>
        </div>
      </div>

      {applicationType && (
        <div className="max-w-4xl mx-auto text-center mt-6">
          <h2 className="text-2xl font-bold mb-4">
            {applicationType === "standard"
              ? "Standard Applications"
              : "Financial Applications"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applicationCategories[applicationType].map((app) => (
              <button
                key={app.key}
                onClick={() => handleApplicationChange(app.key)}
                className={`p-6 rounded-lg shadow-md transition transform hover:scale-105 ${
                  application === app.key
                    ? "bg-blue-100 border-blue-500 border-2"
                    : "bg-white"
                }`}
              >
                <h3 className="text-lg font-bold">{app.title}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {application && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Input Parameters</h3>
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key}>
                  <label className="block mb-1 font-medium">{key}</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={value}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [key]: parseFloat(e.target.value),
                      }))
                    }
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
          </div>

          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Results</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingDots color="#3498db" />
              </div>
            ) : results ? (
              <BrownianLineChart
                trajectories={results}
                timeSteps={inputs.steps || inputs.timeStep}
              />
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

export default BrownianMotionPage;
