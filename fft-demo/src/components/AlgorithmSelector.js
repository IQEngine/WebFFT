import React from 'react';

const AlgorithmSelector = ({ algorithms, onAlgorithmChange }) => {
  return (
    <div>
      <label>Select Algorithm: </label>
      <select onChange={(e) => onAlgorithmChange(e.target.value)}>
        {algorithms.map((algo, index) => (
          <option key={index} value={algo}>
            {algo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlgorithmSelector;
