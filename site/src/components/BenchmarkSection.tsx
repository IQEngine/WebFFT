import React, { useState } from "react";
import { getBrowserVersion, checkSIMDSupport } from "../utils/browserUtils";

interface Props {
  fftSize: number;
  setFftSize: React.Dispatch<React.SetStateAction<number>>;
  numIterations: number;
  setNumIterations: React.Dispatch<React.SetStateAction<number>>;
}

function BenchmarkSection({ fftSize, setFftSize, numIterations, setNumIterations }: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Benchmark your browser</h2>

      <div className="justify-center space-x-4 mt-4">
        <button className="bg-cyber-secondary text-cyber-text  px-4 py-2 rounded-md">Run Benchmark</button>

        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="bg-cyber-background1 text-cyber-text px-4 py-2 rounded-md"
        >
          ☰ Settings
        </button>
      </div>

      {showSettings && (
        <div className="mt-4">
          <div className="items-center mb-2">
            <label htmlFor="fftSize" className="block text-sm">
              FFT Size
            </label>
            <input
              type="number"
              id="fftSize"
              name="fftSize"
              value={fftSize}
              onChange={(e) => setFftSize(parseInt(e.target.value))}
              className="block w-24 mt-1 p-2 border rounded-md text-center bg-cyber-background1"
            />
          </div>
          <div className="items-center mb-2 ">
            <label htmlFor="numIterations" className="block text-sm">
              Number of Iterations
            </label>
            <input
              type="number"
              id="numIterations"
              name="numIterations"
              value={numIterations}
              onChange={(e) => setNumIterations(parseInt(e.target.value))}
              className="block w-24 mt-1 p-2 border rounded-md text-center bg-cyber-background1"
            />
          </div>

          <h3 className="text-lg mt-4">Browser Information</h3>
          <p>
            Browser Version: <span>{getBrowserVersion()}</span>
          </p>
          <p>
            SIMD Support: <span>{checkSIMDSupport()}</span>
          </p>
        </div>
      )}
    </section>
  );
}

export default BenchmarkSection;
