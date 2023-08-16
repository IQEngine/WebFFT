import React from 'react';

const TestConfig = ({ onTestCountChange }) => {
  return (
    <div>
      <label>Number of Tests: </label>
      <input type="number" onChange={(e) => onTestCountChange(e.target.value)} />
    </div>
  );
};

export default TestConfig;
