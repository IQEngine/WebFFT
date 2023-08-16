import React from 'react';
import { TestResult } from '../types/componentTypes';

interface Props {
  results: TestResult[];
}

const TestResults: React.FC<Props> = ({ results }) => {
  return (
    <div>
      <h2>Test Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(TestResults);
