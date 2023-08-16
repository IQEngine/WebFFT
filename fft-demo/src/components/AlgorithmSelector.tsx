import React from 'react';
import { Algorithm } from '../types/componentTypes';

interface Props {
  algorithms: Algorithm[];
  onAlgorithmChange: (algo: Algorithm) => void;
}

const AlgorithmSelector: React.FC<Props> = ({ algorithms, onAlgorithmChange }) => {
  return (
    <div>
      <label>Select Algorithm: </label>
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onAlgorithmChange(e.target.value as Algorithm)}>
        {algorithms.map((algo, index) => (
          <option key={index} value={algo}>
            {algo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(AlgorithmSelector);
