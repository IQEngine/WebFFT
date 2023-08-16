import React, { useState } from 'react';
import './App.css';
import AlgorithmSelector from './components/AlgorithmSelector';
import TestConfig from './components/TestConfig';
import TestResults from './components/TestResults';
import { Algorithm, TestResult } from './types/componentTypes';

const App: React.FC = () => {
  // TODO: Algorithms to be selected
  const availableAlgorithms: Algorithm[] = [
    "FFT Algorithm 1",
    "FFT Algorithm 2",
    "FFT Algorithm 3"
  ];

  // State
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(availableAlgorithms[0]);
  const [testCount, setTestCount] = useState<number>(0);
  const [results, setResults] = useState<TestResult[]>([]);

  // TODO: Add logic to run the selected algorithm 'testCount' number of times
  // and update 'results' state.

  return (
    <div className="App">
      <h1>FFT Algorithm Tester</h1>
      
      <AlgorithmSelector 
        algorithms={availableAlgorithms} 
        onAlgorithmChange={setSelectedAlgorithm}
      />

      <TestConfig 
        onTestCountChange={setTestCount}
      />

      <TestResults results={results} />

      <button onClick={() => {
        // TODO: Handle the run test button click, execute FFT algorithm based on selection and testCount
      }}>
        Run Test
      </button>
    </div>
  );
};

export default App;
