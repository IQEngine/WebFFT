import React, { useState } from 'react';
import './App.css';
import AlgorithmSelector from './components/AlgorithmSelector';
import TestConfig from './components/TestConfig';
import TestResults from './components/TestResults';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [testCount, setTestCount] = useState(0);
  const [results, setResults] = useState([]);

  const algorithms = ["FFT Algorithm 1", "FFT Algorithm 2", "FFT Algorithm 3"]; // You can expand this

  const runTests = () => {
    // Logic to run tests based on selectedAlgorithm and testCount
    // Store the results in the results state
    let mockResults = Array.from({ length: testCount }, (_, i) => `Result ${i + 1}`); // Mocking test results for now
    setResults(mockResults);
  };

  return (
    <div className="App">
      <h1>FFT Demo</h1>
      <AlgorithmSelector algorithms={algorithms} onAlgorithmChange={setSelectedAlgorithm} />
      <TestConfig onTestCountChange={(count) => setTestCount(count)} />
      <button onClick={runTests}>Run Tests</button>
      <TestResults results={results} />
    </div>
  );
}

export default App;
