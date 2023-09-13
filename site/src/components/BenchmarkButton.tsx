import React, { Dispatch, SetStateAction } from "react";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";

interface BenchmarkButtonProps {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
  numIterations: number;
  setNumIterations: Dispatch<SetStateAction<number>>;
  browserInfo: BrowserInfoType;
  setBrowserInfo: Dispatch<SetStateAction<BrowserInfoType>>;
  simdSupport: boolean;
  setSimdSupport: Dispatch<SetStateAction<boolean>>;
}

const BenchmarkButton: React.FC<BenchmarkButtonProps> = ({ fftSize, numIterations, browserInfo, simdSupport }) => {
  const handleBenchmarkRun = () => {
    // Call to profile function with the necessary parameters will go here
    console.log("Benchmark run with the following parameters:");
    console.log("FFT Size:", fftSize);
    console.log("Number of Iterations:", numIterations);
    console.log("Browser Info:", browserInfo);
    console.log("SIMD Support:", simdSupport);
  };

  return (
    <Button onClick={handleBenchmarkRun} className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md">
      Run Benchmark
    </Button>
  );
};

export default BenchmarkButton;
