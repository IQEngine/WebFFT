import React, { useState, useEffect } from "react";
import FFTSizeInput from "./FFTSizeInputButton";
import BenchmarkButton from "./BenchmarkButton";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";
import { getBrowserInfo, checkSIMDSupport } from "../utils/browserUtils";

interface Props {
  fftSize: number;
  setFftSize: React.Dispatch<React.SetStateAction<number>>;
  numIterations: number;
  setNumIterations: React.Dispatch<React.SetStateAction<number>>;
}

function BenchmarkSection({ fftSize, setFftSize, numIterations, setNumIterations }: Props) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfoType>({
    browserName: "Unknown",
    version: "Unknown",
    os: "Unknown",
  });
  const [simdSupport, setSimdSupport] = useState<boolean>(false);

  useEffect(() => {
    setBrowserInfo(getBrowserInfo());
    setSimdSupport(checkSIMDSupport());
  }, []);

  const renderBrowserInfo = () => {
    if (browserInfo) {
      const { browserName, version, os } = browserInfo;
      return (
        <span className="text-cyber-accent">
          {browserName}
          <br />
          {version ?? ""}
          <br />
          {os ?? ""}
        </span>
      );
    }
    return <span className="text-cyber-accent">Browser not recognized or detected.</span>;
  };

  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Benchmark your browser</h2>

      <div className="flex justify-center space-x-4 mt-4">
        <BenchmarkButton
          fftSize={fftSize}
          setFftSize={setFftSize}
          numIterations={numIterations}
          setNumIterations={setNumIterations}
          browserInfo={browserInfo}
          setBrowserInfo={setBrowserInfo}
          simdSupport={simdSupport}
          setSimdSupport={setSimdSupport}
        />

        <Button
          onClick={() => setShowSettings((prev) => !prev)}
          className="bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 rounded-md"
        >
          ☰ Settings
        </Button>
      </div>

      {showSettings && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
          <div className="col-span-1 flex flex-col items-center mb-4">
            <label htmlFor="fftSize" className="block text-sm mb-1">
              FFT Size
            </label>
            <FFTSizeInput fftSize={fftSize} setFftSize={setFftSize} />
          </div>

          <div className="col-span-1 flex flex-col items-center mb-4">
            <label htmlFor="numIterations" className="block text-sm mb-1">
              Number of Iterations
            </label>
            <input
              type="number"
              id="numIterations"
              name="numIterations"
              value={numIterations}
              onChange={(e) => setNumIterations(parseInt(e.target.value))}
              className="border rounded-md text-center bg-cyber-background1 border-cyber-primary"
            />
          </div>

          <div className="col-span-1 flex flex-col items-center mb-4">
            <p className="text-center">
              Browser Information: <br />
              {renderBrowserInfo()}
            </p>
          </div>

          <div className="col-span-1 flex flex-col items-center mb-4">
            <p className="text-center">
              SIMD Support: <br />
              <span className="text-cyber-accent">{simdSupport ? "Supported" : "Not supported"}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default BenchmarkSection;
