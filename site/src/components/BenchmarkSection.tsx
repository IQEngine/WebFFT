import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";
import FFTSizeInput from "./FFTSizeInputButton";
import ResultsSection from "./ResultsSection";
import BenchmarkButton from "./BenchmarkButton";
import Button from "./Button";
import { BrowserInfoType } from "../types/types";
import { getBrowserInfo, checkSIMDSupport } from "../utils/browserUtils";
import webfft, { ProfileResult } from "webfft";

interface Props {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  handleClearAppState: Dispatch<any>;
}

function BenchmarkSection({ fftSize, setFftSize, duration, setDuration, handleClearAppState }: Props) {
  const worker = new Worker("worker.tsx", { type: "module" });

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfoType>({
    browserName: "Unknown",
    version: "Unknown",
    os: "Unknown",
  });
  const [simdSupport, setSimdSupport] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<ProfileResult | null>(null);
  const [durationError, setDurationError] = useState<boolean>(false);
  const [profileResultsLoader, setProfileResultsLoader] = useState<boolean>(false);

  useEffect(() => {
    setBrowserInfo(getBrowserInfo());
    setSimdSupport(checkSIMDSupport());
    // const listener = (data: any) => {
    //   if (data.type === "UPDATE_SUCCESS") {
    //     console.log("Results:", data.payload);
    //     setBenchmarkData(data.payload);
    //     setProfileResultsLoader(false);
    //   }
    // };
    // worker.addEventListener("message", listener);
  }, []);

  worker.onmessage = function (event: MessageEvent<ProfileResult>) {
    setBenchmarkData(event.data);
    setProfileResultsLoader(false);
  };

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    var val = parseInt(event.target.value);
    if (val > 0) {
      setDuration(val);
      setDurationError(false);
    } else {
      setDurationError(true);
      setDuration(0);
    }
  };

  const handleClearState = () => {
    setBenchmarkData(null);
    setDurationError(false);
    handleClearAppState(true);
  };

  const handleRunProfile = async (_: any) => {
    // const profileObj: ProfileResult = fft.profile(duration); // arg is duration to run profile, in seconds
    // console.log("Results:", profileObj);
    // setBenchmarkData( Profile(fftSize, duration));
    // setProfileResultsLoader(false);
    worker.postMessage({ payload: { fftSize, duration } });
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

  return (
    <div>
      <section className="mb-6 text-center">
        <h2 className="text-xl">Benchmark your browser</h2>

        <div className="flex justify-center space-x-4 mt-4">
          <BenchmarkButton
            fftSize={fftSize}
            duration={duration}
            browserInfo={browserInfo}
            simdSupport={simdSupport}
            setBenchmarkData={setBenchmarkData}
            setProfileResultsLoader={setProfileResultsLoader}
            handleRunProfile={handleRunProfile}
          />

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
              <label htmlFor="duration" className="block text-sm mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={duration}
                onChange={handleDurationChange}
                className="border rounded-md text-center bg-cyber-background1 border-cyber-primary"
              />
              {durationError && (
                <span className="text-cyber-primary">Invalid Input: Duration can only be a positive integer</span>
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
      <ResultsSection benchmarkData={benchmarkData} loading={profileResultsLoader} />
    </div>
  );
}

export default BenchmarkSection;
