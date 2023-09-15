import { useState, useEffect } from "react";
import webfft from "webfft";
import Plot from "react-plotly.js";
import { fftshift } from "fftshift";

function InteractiveSignal() {
  const fftSize = 1024;
  const [signalStr, setSignalStr] = useState<any>(null);
  const [amplitude, setAmplitude] = useState<number>(20);
  const [frequency, setFrequency] = useState<number>(0.1);
  //const [update, setUpdate] = useState<number>(0);
  const [I, setI] = useState<Float32Array>();
  const sin = new Float32Array(2 * fftSize);

  const webfftInstance = new webfft(fftSize);

  useEffect(() => {
    webfftInstance.profile(0.5);
  }, []);

  useEffect(() => {
    const x0 = 0; // starting point of curve wrt SVG canvas
    const y0 = 50;
    let sinString = "M " + x0 + "," + y0;

    sin.fill(0);
    const t = new Date().getTime();

    for (let i = 0; i < fftSize; i++) {
      sinString +=
        " L " +
        (x0 + i) +
        "," +
        (y0 + 2 * amplitude * Math.sin(frequency * i + t));
      sin[2 * i] = 2 * amplitude * Math.sin(frequency * i + t);
    }

    setSignalStr(sinString);
    const psd = webfftInstance.fft(sin);
    const mag = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      mag[i] = Math.sqrt(
        psd[2 * i] * psd[2 * i] + psd[2 * i + 1] * psd[2 * i + 1],
      );
    }
    setI(fftshift(mag).slice(fftSize / 2, fftSize));
  }, [amplitude, frequency]);

  /*
  function refresh() {
    setUpdate(update + 1);
  }

  useEffect(() => {
    const timerId = setInterval(refresh, 50); // in ms
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
            min={-20}
            max={20}
            step={0.01}
            onChange={(e) => {
              setAmplitude(Number(e.target.value));
            }}
          />
        </label>

        <label className="mb-3" id="formZoom">
          <span className="label-text text-base ">Signal Frequency</span>
          <input
            type="range"
            className="range range-xs range-primary"
            value={String(frequency)}
            min={0.01}
            max={Math.PI}
            step={0.001}
            onChange={(e) => {
              setFrequency(Number(e.target.value));
            }}
          />
        </label>

        <svg width={fftSize} height="100" viewBox="0 0 1024 100">
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

        <Plot
          data={[
            {
              y: I,
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
              title: "Time",
            },
            yaxis: {
              title: "Samples",
              fixedrange: true,
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
