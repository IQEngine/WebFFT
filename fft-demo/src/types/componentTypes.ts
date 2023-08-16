import { Complex } from "mathjs";

export interface Algorithm {
  name: string;
  description?: string;
}

export interface TestResult {
  id: string;
  data: Complex[];
}

export interface TestResultsProps {
  results: TestResult[];
}

export interface AlgorithmSelectorProps {
  onAlgorithmChange: (selectedAlgorithm: string) => void;
  algorithms?: Algorithm[];
}

export interface TestConfigProps {
  onNumTestsChange: (testCount: number) => void;
}

export interface CardProps {
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface DataPoint {
  id: string;
  data: Complex[];
}

export interface FFTProps {
  data: DataPoint[];
}
