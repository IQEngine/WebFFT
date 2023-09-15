import { useState, useEffect } from "react";
import webfft from "webfft";
import Plot from "react-plotly.js";
import { fftshift } from "fftshift";

function InteractiveSignal() {
  const fftSize = 1024;
  const [signalStr, setSignalStr] = useState<any>(null);
  const [amplitude, setAmplitude] = useState<number>(20);
  const [frequency, setFrequency] = useState<number>(0.1);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [update, setUpdate] = useState<number>(0);
  const [plotData, setPlotData] = useState<Float32Array>();
  const [start, setStart] = useState<boolean>(false);
  const sin = new Float32Array(2 * fftSize);
  const [webfftInstance, setWebfftInstance] = useState<any>(null);

  useEffect(() => {
    setWebfftInstance(new webfft(fftSize));
  }, []);

  useEffect(() => {
    if (webfftInstance) {
      //webfftInstance.setSubLibrary("indutnyJavascript");
      webfftInstance.profile(0.5);
    }
  }, [webfftInstance]);

  useEffect(() => {
    if (start) {
      const y0 = 75;
      let sinString = "M " + 0 + "," + y0;

      sin.fill(0);
      const t = new Date().getTime();

      for (let i = 0; i < fftSize; i++) {
        const sample =
          2 * amplitude * Math.sin(frequency * i + t) +
          (Math.random() - 0.5) * 50;
        sinString += " L " + i + "," + (y0 + sample);
        sin[2 * i] = sample;
      }

      setSignalStr(sinString);
      const psd = webfftInstance.fft(sin);
      const mag = new Float32Array(fftSize);
      for (let i = 0; i < fftSize; i++) {
        mag[i] = Math.sqrt(
          psd[2 * i] * psd[2 * i] + psd[2 * i + 1] * psd[2 * i + 1],
        );
      }
      setPlotData(fftshift(mag).slice(fftSize / 2, fftSize));
      setLastUpdate(performance.now());
    }
  }, [amplitude, frequency, update]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setUpdate(Math.random());
    }, 50); // in ms
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  /*
  // will trigger the main useeffect to run again
  useEffect(() => {
    const timerId = setInterval(() => {
      setUpdate(Math.random());
    }, 50); // in ms
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  */

  return (
    <section className="mb-6 text-center">
      <div className="w-64 p-4">
        <label className="mb-3" id="formZoom">
          <span className="label-text text-base ">Signal Amplitude</span>
          <input
            type="range"
            className="range range-xs range-primary"
            value={String(amplitude)}
            min={0}
            max={20}
            step={0.1}
            onChange={(e) => {
              setAmplitude(Number(e.target.value));
            }}
          />
        </label>
        <br></br>
        <label className="mb-3" id="formZoom">
          <span className="label-text text-base ">Signal Frequency</span>
          <input
            type="range"
            className="range range-xs range-primary"
            value={String(frequency)}
            min={0.01}
            max={Math.PI * 0.9}
            step={0.01}
            onChange={(e) => {
              setFrequency(Number(e.target.value));
            }}
          />
        </label>
        <svg width={fftSize} height="150" viewBox="0 0 1024 150">
          <g>
            <path
              id="logo-sin-curve"
              d={signalStr}
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
          </g>
        </svg>

        <button className="btn btn-primary" onClick={() => setStart(!start)}>
          Start/Stop
        </button>
        <Plot
          data={[
            {
              y: plotData,
              type: "scatter",
              name: "I",
            },
          ]}
          layout={{
            width: 500,
            height: 300,
            margin: {
              l: 0,
              r: 0,
              b: 0,
              t: 0,
              pad: 0,
            },
            dragmode: "pan",
            showlegend: false,
            xaxis: {
              title: "Frequency",
            },
            yaxis: {
              title: "PSD",
              autorange: false,
              range: [0, 30000],
            },
          }}
          config={{
            displayModeBar: false,
            scrollZoom: true,
          }}
        />
      </div>
    </section>
  );
}

export default InteractiveSignal;
