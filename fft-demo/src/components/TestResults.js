import React from 'react';

const TestResults = ({ results }) => {
  return (
    <div>
      <h2>Test Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestResults;
