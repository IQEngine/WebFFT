import React, { useState } from "react";
import "./styles/App.css";
import AlgorithmSelector from "./components/AlgorithmSelector";
import TestConfig from "./components/TestConfig";
import TestResults from "./components/TestResults";
import { Algorithm, TestResult } from "./types/componentTypes";
import { generateRandomComplexNumbers } from "./utils/dataGenerators";

const App: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [numTests, setNumTests] = useState<number>(1);
  const [results, setResults] = useState<TestResult[]>([]); // Assuming the same Result type from TestResults.tsx

  const mockAlgorithms: Algorithm[] = [
    { name: "Algorithm A", description: "This is Algorithm A." },
    { name: "Algorithm B", description: "This is Algorithm B." },
    // ... add other algorithms as needed
  ];

  const handleAlgorithmChange = (selectedAlgorithmName: string) => {
    const selectedAlgorithm = mockAlgorithms.find(
      (algo) => algo.name === selectedAlgorithmName
    );
    if (selectedAlgorithm) {
      setAlgorithm(selectedAlgorithm);
    }
  };

  const handleNumTestsChange = (testCount: number) => {
    setNumTests(testCount);
  };

  // Mocked function for demonstration purposes.
  const runTests = () => {
    const complexData = generateRandomComplexNumbers(1000);
    // This is where you'd typically run the FFT tests for the chosen algorithm and number of tests.
    // For now, I'll use a mock result.
    const mockResults: TestResult[] = [
      {
        id: "Mock FFT Result 1",
        data: complexData.slice(0, 1000),
      },
      // Add more mock results if needed
    ];
    setResults(mockResults);
  };

  return (
    <div className="app">
      <h1>FFT Algorithm Tester</h1>
      <AlgorithmSelector
        onAlgorithmChange={handleAlgorithmChange}
        algorithms={mockAlgorithms}
      />
      <TestConfig onNumTestsChange={handleNumTestsChange} />
      <button onClick={runTests}>Run Tests</button>
      {results.length > 0 && <TestResults results={results} />}
    </div>
  );
};

export default App;
