import React, { Dispatch, SetStateAction, FC } from "react";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";
import webfft, { ProfileResult } from "webfft";

interface BenchmarkButtonProps {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
  numIterations: number;
  setNumIterations: Dispatch<SetStateAction<number>>;
  browserInfo: BrowserInfoType;
  setBrowserInfo: Dispatch<SetStateAction<BrowserInfoType>>;
  simdSupport: boolean;
  setSimdSupport: Dispatch<SetStateAction<boolean>>;
  setBenchmarkData: Dispatch<SetStateAction<ProfileResult | null>>;
  setProfileResultsLoader: Dispatch<SetStateAction<boolean>>;
}

const BenchmarkButton: FC<BenchmarkButtonProps> = ({
  fftSize,
  setFftSize, // used later for impl (along with other setProps below)
  numIterations,
  setNumIterations,
  browserInfo,
  setBrowserInfo,
  simdSupport,
  setSimdSupport,
  setBenchmarkData,
  setProfileResultsLoader,
}) => {
  const handleBenchmarkRun = () => {
    setProfileResultsLoader(true);
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
    setBenchmarkData(profileObj);
    setProfileResultsLoader(false);
  };

  return (
    <Button onClick={handleBenchmarkRun} className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md">
      Run Benchmark
    </Button>
  );
};

export default BenchmarkButton;
