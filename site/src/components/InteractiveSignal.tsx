import React, { useState, useEffect, useRef } from "react";
import webfft from "webfft";
import { Line } from "react-chartjs-2";
// @ts-ignore
import { fftshift } from "fftshift";

function InteractiveSignal() {
  const fftSize = 1024;
  const [signalStr, setSignalStr] = useState<any>(null);
  const [amplitude, setAmplitude] = useState<number>(20);
  const [frequency, setFrequency] = useState<number>(0.1);
  const [_, setLastUpdate] = useState<any>(null);
  const [update, setUpdate] = useState<number>(0);
  const [plotData, setPlotData] = useState<Float32Array>(new Float32Array());
  const [start, setStart] = useState<boolean>(false);
  const fftWorker = useRef<Worker>();
  const textColor = "hsla(0, 0%, 80%, 0.9)";
  const waveColor = "rgb(34 197 94)";
  const startRef = useRef(false);
  const slidersChanged = useRef(false);

  useEffect(() => {
    // Initialization of the worker when the component mounts
    fftWorker.current = new Worker(
      new URL("../utils/webworker.tsx", import.meta.url),
      { type: "module" },
    );

    return () => {
      // Cleanup function to terminate the worker when the component unmounts
      fftWorker.current?.terminate();
    };
  }, []);

  useEffect(() => {
    startRef.current = start; // Keep the ref updated with the latest value of the start state
  }, [start]);

  const handleStop = () => {
    setStart(false);

    let neutralSignalStr = "M0,75";
    for (let i = 1; i < fftSize; i++) {
      neutralSignalStr += ` L${i},75`;
    }
    setSignalStr(neutralSignalStr);

    setPlotData(new Float32Array(fftSize / 2).fill(0));
  };

  useEffect(() => {
    if (start && fftWorker.current) {
      fftWorker.current.postMessage({
        type: "FFT_CALCULATION",
        amplitude,
        frequency,
      });

      fftWorker.current.onmessage = (e: MessageEvent<any>) => {
        if (!startRef.current) return; // If the start state has changed, ignore the message
        const data = e.data;

        if (data.type === "FFT_RESULT") {
          setSignalStr(data.sinString);
          setPlotData(
            fftshift(data.mag).slice(data.mag.length / 2, data.mag.length),
          );
          setLastUpdate(performance.now());
        }
      };
      return () => {
        if (!start) {
          handleStop();
          fftWorker.current?.terminate();
          fftWorker.current = new Worker(
            new URL("../utils/webworker.tsx", import.meta.url),
            { type: "module" },
          );
        }
      };
    }
  }, [amplitude, frequency, update, start]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setUpdate(Math.random());
    }, 50); // in ms
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    slidersChanged.current = false;
  }, [start]);

  const handleAmplitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmplitude(Number(e.target.value));
    slidersChanged.current = true;
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(Number(e.target.value));
    slidersChanged.current = true;
  };

  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl" aria-describedby="See our WebFFT in action!">
        WebFFT In Action!
      </h2>
      <div className="max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
        {/* Start/Stop Button */}
        <div className="mb-3">
          <button
            className="px-4 py-2 text-cyber-text bg-green-500 rounded hover:bg-cyber-accent focus:outline-none"
            onClick={() => {
              if (start) {
                handleStop();
              } else {
                setStart(true);
              }
            }}
          >
            Start/Stop
          </button>
        </div>
        {/* Amplitude Control */}
        <div className="mb-3 flex justify-between items-center">
          <span className="text-cyber-text text-base">Signal Amplitude</span>
          <input
            type="range"
            className="range range-xs range-primary"
            value={String(amplitude)}
            min={0}
            max={20}
            step={0.1}
            onChange={handleAmplitudeChange}
          />
        </div>
        {/* Frequency Control */}
        <div className="mb-3 flex justify-between items-center">
          <span className="text-cyber-text text-base">Signal Frequency</span>
          <input
            type="range"
            className="range range-xs range-primary"
            value={String(frequency)}
            min={0.01}
            max={Math.PI * 0.9}
            step={0.01}
            onChange={handleFrequencyChange}
          />
        </div>
        {/* SVG Plot */}
        <div className="mb-3 relative w-full h-36 bg-gray-700 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 1024 150">
            <g>
              <path
                id="logo-sin-curve"
                d={signalStr}
                stroke={waveColor}
                strokeWidth="0.5"
                fill="none"
              />
            </g>
          </svg>
        </div>
        {/* ChartJS Plot */}
        <div className="mb-3 w-full">
          <Line
            data={{
              labels: Array.from(
                { length: plotData?.length || 0 },
                (_, i) => i,
              ),
              datasets: [
                {
                  label: "Dataset",
                  data: plotData,
                  fill: false,
                  borderColor: waveColor,
                  borderWidth: 1,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  display: true,
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Frequency",
                    color: textColor,
                  },
                  ticks: {
                    display: false,
                    color: textColor,
                  },
                },
                y: {
                  display: true,
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "PSD",
                    color: textColor,
                  },
                  ticks: {
                    display: false,
                    color: textColor,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default React.memo(InteractiveSignal);
