import React from "react";
import { TestResultsProps } from "../types/componentTypes";
import Card from "./Card";
import FFTScatterplot from "./FFTScatterPlot";
import PSDPlot from "./PSDPlot";

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  return (
    <div>
      <h2>Test Results</h2>
      <div className="card-container">
        {results.map((result, index) => (
          <React.Fragment key={index}>
            <Card title={`${result.id} - Scatterplot`}>
              <FFTScatterplot data={[result]} />
            </Card>
            <Card title={`${result.id} - Other Plot`}>
              <PSDPlot data={[result]} />
            </Card>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
