import React from 'react';

interface Props {
  onTestCountChange: (count: number) => void;
}

const TestConfig: React.FC<Props> = ({ onTestCountChange }) => {
  return (
    <div>
      <label>Number of Tests: </label>
      <input 
        type="number" 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTestCountChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default React.memo(TestConfig);
