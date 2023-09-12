import React from "react";
import { TestConfigProps } from "../types/componentTypes";

const TestConfig: React.FC<TestConfigProps> = ({ onNumTestsChange }) => {
  return (
    <div>
      <label>Number of Tests: </label>
      <input
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNumTestsChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default TestConfig;
