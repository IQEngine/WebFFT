import React from "react";
import Button from "./Button";
import { BrowserInfoType, MockTestResultsType } from "../types/types";
import webfft, { ProfileResult } from "webfft";

interface BenchmarkButtonProps {
  fftSize: number;
  setFftSize: React.Dispatch<React.SetStateAction<number>>;
  numIterations: number;
  setNumIterations: React.Dispatch<React.SetStateAction<number>>;
  browserInfo: BrowserInfoType;
  setBrowserInfo: React.Dispatch<React.SetStateAction<BrowserInfoType>>;
  simdSupport: boolean;
  setSimdSupport: React.Dispatch<React.SetStateAction<boolean>>;
  setBenchmarkData: React.Dispatch<React.SetStateAction<MockTestResultsType | null>>;
}

const BenchmarkButton: React.FC<BenchmarkButtonProps> = ({
  fftSize,
  setFftSize, // used later for impl (along with other setProps below)
  numIterations,
  setNumIterations,
  browserInfo,
  setBrowserInfo,
  simdSupport,
  setSimdSupport,
  setBenchmarkData,
}) => {
  const handleMockData = () => {
    setBenchmarkData({
      results: [
        {
          FFTSize: 1024,
          numIterations: 1000,
          browserInfo: { browserName: "Chrome", version: null, os: null },
          simdSupport: true,
          testResult: 100,
        },
        {
          FFTSize: 2048,
          numIterations: 1000,
          browserInfo: { browserName: "Mozilla", version: null, os: null },
          simdSupport: true,
          testResult: 500,
        },
        {
          FFTSize: 4096,
          numIterations: 1000,
          browserInfo: { browserName: "Edge", version: null, os: null },
          simdSupport: true,
          testResult: 1000,
        },
        {
          FFTSize: 8192,
          numIterations: 1000,
          browserInfo: { browserName: "Edge", version: null, os: null },
          simdSupport: true,
          testResult: 1200,
        },
        {
          FFTSize: 16384,
          numIterations: 1000,
          browserInfo: { browserName: "Chrome", version: null, os: null },
          simdSupport: true,
          testResult: 120,
        },
      ],
    });
  };

  const handleBenchmarkRun = () => {
    handleMockData();
    // Call to profile function with the necessary parameters will go here
    console.log("Benchmark run with the following parameters:");
    console.log("FFT Size:", fftSize);
    console.log("Number of Iterations:", numIterations);
    console.log("Browser Info:", browserInfo);
    console.log("SIMD Support:", simdSupport);
    console.log(setBenchmarkData);

    const fft = new webfft(fftSize);
    const profileObj: ProfileResult = fft.profile(); // arg is duration to run profile, in seconds
    console.log("Results:", profileObj);
  };

  return (
    <Button onClick={handleBenchmarkRun} className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md">
      Run Benchmark
    </Button>
  );
};

export default BenchmarkButton;
