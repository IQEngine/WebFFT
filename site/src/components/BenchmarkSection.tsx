import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";
import FFTSizeInput from "./FFTSizeInputButton";
import ResultsSection from "./ResultsSection";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";
import { getBrowserInfo, checkSIMDSupport } from "../utils/browserUtils";
import webfft, { ProfileResult } from "webfft";
import { BallTriangle } from "react-loader-spinner";

interface Props {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
  numIterations: number;
  setNumIterations: Dispatch<SetStateAction<number>>;
  handleClearAppState: Dispatch<any>;
}

function BenchmarkSection({ fftSize, setFftSize, numIterations, setNumIterations, handleClearAppState }: Props) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfoType>({
    browserName: "Unknown",
    version: "Unknown",
    os: "Unknown"
  });
  const [simdSupport, setSimdSupport] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [numIterationsError, setNumIterationsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setBrowserInfo(getBrowserInfo());
    setSimdSupport(checkSIMDSupport());
  }, []);

  const handleNumIterationsChange = (event: ChangeEvent<HTMLInputElement>) => {
    var val = parseInt(event.target.value);
    if (val > 0) {
      setNumIterations(val);
      setNumIterationsError(false);
    } else {
      setNumIterationsError(true);
      setNumIterations(0);
    }
  };

  const handleClearState = () => {
    setBenchmarkData(null);
    setNumIterationsError(false);
    handleClearAppState(true);
  };

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

  // This will run when you click the run benchmark button
  useEffect(() => {
    if (loading) {
      const fft = new webfft(fftSize);
      const profileObj: ProfileResult = fft.profile(1); // arg is duration to run profile, in seconds
      console.log("Results:", profileObj);

      // Get the color for each browser
      const getBarColor = (label: string) => {
        if (label.includes("Wasm")) return `hsl(200, 100%, 50%, 0.75)`;
        if (label.includes("Javascript")) return `hsla(320, 80%, 50%, 0.8)`;
        return `hsla(100, 80%, 50%, 0.8)`; // shouldn't get here
      };

      // Create a list of unique labels for the x-axis
      const newLabels = profileObj.subLibraries;

      // Create datasets for the bar chart
      const datasets = [
        {
          label: "Results",
          data: profileObj.fftsPerSecond,
          backgroundColor: newLabels.map((label) => getBarColor(label)),
          borderColor: newLabels.map(() => `hsla(0, 0%, 80%, 0.9)`),
          borderWidth: 1
        }
      ];

      setBenchmarkData({
        labels: newLabels,
        datasets: datasets
      });

      setLoading(false);
    }
  }, [loading]);

  return (
    <div>
      <section className="mb-6 text-center">
        <h2 className="text-xl">Benchmark your browser</h2>

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={() => {
              setLoading(true);
            }}
            className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md"
          >
            Run Benchmark
          </Button>

          <Button
            onClick={() => setShowSettings((prev) => !prev)}
            className="bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 rounded-md"
          >
            ☰ Settings
          </Button>
          <Button
            onClick={handleClearState}
            className="bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 space-x-4 rounded-md"
          >
            ❌ Clear
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
                onChange={handleNumIterationsChange}
                className="border rounded-md text-center bg-cyber-background1 border-cyber-primary"
              />
              {numIterationsError && (
                <span className="text-cyber-primary">
                  Invalid Input: Number of interations can only be a positive integer
                </span>
              )}
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

      <div className="max-w-lg max-h-96 mx-auto p-4">
        {loading && (
          <BallTriangle
            height={150}
            width={150}
            radius={6}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{ justifyContent: "center" }}
            visible={true}
          />
        )}
      </div>

      <ResultsSection benchmarkData={benchmarkData} />
    </div>
  );
}

export default BenchmarkSection;
