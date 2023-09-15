import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import FFTSizeInput from "./FFTSizeInputButton";
import ResultsSection from "./ResultsSection";
import Button from "./Button";
import webfft, { BrowserCapabilities, ProfileResult } from "webfft";

interface Props {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  handleClearAppState: Dispatch<any>;
}

function BenchmarkSection({
  fftSize,
  setFftSize,
  duration,
  setDuration,
  handleClearAppState,
}: Props) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserCapabilities, setBrowserInfo] = useState<BrowserCapabilities>({
    browserName: "Unknown",
    browserVersion: "Unknown",
    osName: "Unknown",
    osVersion: "Unknown",
    wasm: false,
    relaxedSimd: false,
    simd: false,
  });
  const [simdSupport, setSimdSupport] = useState<boolean>(false);
  const [relaxedSimdSupport, setRelaxedSimdSupport] = useState<boolean>(false);
  const [wasmSupport, setWasmSupport] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const webfftInstance = new webfft(128);
    webfftInstance
      .checkBrowserCapabilities()
      .then((browserResult) => {
        setBrowserInfo(browserResult);
      })
      .catch((error) => {
        console.error("Failed to check browser capabilities:", error);
      });
    webfftInstance.dispose();
  }, []);

  useEffect(() => {
    if (browserCapabilities) {
      setSimdSupport(browserCapabilities.simd);
      setRelaxedSimdSupport(browserCapabilities.relaxedSimd);
      setWasmSupport(browserCapabilities.wasm);
    }
  }, [browserCapabilities]);

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    var val = parseInt(event.target.value);
    if (val > 1) {
      setDuration(val);
    } else {
      setDuration(1);
    }
  };

  const handleClearState = () => {
    setBenchmarkData(null);
    handleClearAppState(true);
  };

  const renderBrowserInfo = () => {
    if (browserCapabilities) {
      return (
        <div className="text-cyber-accent">
          <div>
            <strong>Browser: </strong>
            {browserCapabilities.browserName ?? "Unknown"}{" "}
            {<span>{browserCapabilities.browserVersion}</span> ?? ""}
          </div>
          <div>
            <strong>OS: </strong>
            {browserCapabilities.osName ?? "Unknown"}{" "}
            {<span>{browserCapabilities.osVersion}</span> ?? ""}
          </div>
        </div>
      );
    }
    return (
      <span className="text-cyber-accent">
        Browser not recognized or detected.
      </span>
    );
  };

  // This will run when you click the run benchmark button
  useEffect(() => {
    if (loading) {
      // allow UI to update before starting long running task
      const fftWorker = new Worker(
        new URL("../utils/webworker.tsx", import.meta.url),
        { type: "module" },
      );

      fftWorker.postMessage([fftSize, duration]);

      fftWorker.onmessage = (e: MessageEvent<ProfileResult>) => {
        const profileObj = e.data;

        const wasmColor = "hsl(200, 100%, 50%, 0.75)";
        const jsColor = "hsla(320, 80%, 50%, 0.8)";

        // Create a list of unique labels for the x-axis
        const newLabels = profileObj.subLibraries;

        // Separate the data into two datasets while maintaining the correct mapping to the x-axis labels
        const wasmData = newLabels.map((label, index) =>
          label.includes("Wasm") ? profileObj.fftsPerSecond[index] : null,
        );
        const jsData = newLabels.map((label, index) =>
          label.includes("Javascript") ? profileObj.fftsPerSecond[index] : null,
        );

        // Create datasets for the bar chart
        const datasets = [
          {
            label: "WASM",
            data: wasmData,
            backgroundColor: wasmColor,
            borderColor: "hsla(0, 0%, 80%, 0.9)",
            borderWidth: 1,
          },
          {
            label: "JavaScript",
            data: jsData,
            backgroundColor: jsColor,
            borderColor: "hsla(0, 0%, 80%, 0.9)",
            borderWidth: 1,
          },
        ];

        setBenchmarkData({
          labels: newLabels,
          datasets: datasets,
        });

        setLoading(false);
      };

      return () => {
        fftWorker.terminate();
      };
    }
  }, [loading, fftSize, duration]);

  return (
    <div>
      <section className="mb-6 text-center">
        <h2
          className="text-xl"
          aria-describedby="Test FFTs per Second in this Benchmark Section"
        >
          Benchmark your browser
        </h2>

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={() => {
              setBenchmarkData(null);
              setLoading(true);
            }}
            className="bg-cyber-secondary text-cyber-text px-4 py-2 rounded-md"
            aria-label="Run Benchmark Test Button"
          >
            Run Benchmark
          </Button>

          <Button
            onClick={() => setShowSettings((prev) => !prev)}
            className="bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 rounded-md"
            aria-label="Show Settings Button"
          >
            ☰ Settings
          </Button>
          <Button
            onClick={handleClearState}
            className="bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 space-x-4 rounded-md"
            aria-label="Clear Benchmark Results Button"
          >
            ❌ Clear
          </Button>
        </div>

        {showSettings && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
            <div className="col-span-1 flex flex-col items-center mb-4">
              <span className="block text-base mb-1">FFT Size</span>
              <FFTSizeInput fftSize={fftSize} setFftSize={setFftSize} />
            </div>

            <div className="col-span-1 flex flex-col items-center mb-4">
              <label htmlFor="duration" className="block text-base mb-1">
                Duration to Run Benchmark in Seconds
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={duration}
                onChange={handleDurationChange}
                className="border rounded-md text-center bg-cyber-background1 border-cyber-primary w-32"
                aria-label="Input Duration to Run Benchmark in Seconds"
              />
            </div>

            <div className="col-span-2 flex flex-col items-center mb-4 space-y-2">
              <span className="text-center">
                Browser Information: <br />
                {renderBrowserInfo()}
              </span>
              <span className="text-center">
                SIMD Support: <br />
                <span className="text-cyber-accent">
                  {simdSupport ? "Supported" : "Not supported"}
                </span>
              </span>
              <span className="text-center">
                Relaxed SIMD: <br />
                <span className="text-cyber-accent">
                  {relaxedSimdSupport ? "Enabled" : "Disabled"}
                </span>
              </span>
              <span className="text-center">
                WASM Support: <br />
                <span className="text-cyber-accent">
                  {wasmSupport ? "Supported" : "Not supported"}
                </span>
              </span>
            </div>
          </div>
        )}
      </section>

      <ResultsSection benchmarkData={benchmarkData} loading={loading} />
    </div>
  );
}

export default BenchmarkSection;
