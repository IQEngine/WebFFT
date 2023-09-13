import React, { Dispatch, SetStateAction, FC } from "react";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";
import { ProfileResult } from "webfft";

interface BenchmarkButtonProps {
  fftSize: number;
  duration: number;
  browserInfo: BrowserInfoType;
  simdSupport: boolean;
  setBenchmarkData: Dispatch<SetStateAction<ProfileResult | null>>;
  setProfileResultsLoader: Dispatch<SetStateAction<boolean>>;
  handleRunProfile: Dispatch<any>;
}

const BenchmarkButton: FC<BenchmarkButtonProps> = ({
  fftSize,
  duration,
  browserInfo,
  simdSupport,
  setBenchmarkData,
  setProfileResultsLoader,
  handleRunProfile,
}) => {
  const handleBenchmarkRun = () => {
    setProfileResultsLoader(true);
    // Call to profile function with the necessary parameters will go here
    console.log("Benchmark run with the following parameters:");
    console.log("FFT Size:", fftSize);
    console.log("Number of Iterations:", duration);
    console.log("Browser Info:", browserInfo);
    console.log("SIMD Support:", simdSupport);
    console.log(setBenchmarkData);
    setBenchmarkData(null);
    handleRunProfile(true);
  };

  return (
    <Button onClick={handleBenchmarkRun} className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md">
      Run Benchmark
    </Button>
  );
};

export default BenchmarkButton;
