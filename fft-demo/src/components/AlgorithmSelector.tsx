import React from "react";
import { AlgorithmSelectorProps } from "../types/componentTypes";

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  onAlgorithmChange,
  algorithms = [],
}) => {
  return (
    <div>
      <label>Select an Algorithm:</label>
      <select onChange={(e) => onAlgorithmChange(e.target.value)}>
        {algorithms.map((algorithm, index) => (
          <option key={index} value={algorithm.name}>
            {algorithm.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlgorithmSelector;
