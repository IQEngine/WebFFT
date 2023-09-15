import { useState, useEffect } from "react";
import webfft from "webfft";

function InteractiveSignal() {
  const fftSize = 1024;
  const [signalStr, setSignalStr] = useState<any>(null);
  const [signal, setSignal] = useState<any>(null);
  const [psd, setPsd] = useState<any>(null);
  const [amplitude, setAmplitude] = useState<number>(20);
  //const [update, setUpdate] = useState<number>(0);
  const webfftInstance = new webfft(128);

  useEffect(() => {
    webfftInstance.profile(0.5);
  }, []);

  useEffect(() => {
    const x0 = 0; // starting point of curve wrt SVG canvas
    const y0 = 50;
    let sinString = "M " + x0 + "," + y0;
    let sin = new Float32Array(fftSize);
    const t = new Date().getTime();

    for (let i = 0; i < fftSize; i++) {
      sinString +=
        " L " + (x0 + i) + "," + (y0 + 2 * amplitude * Math.sin(0.1 * i + t));
      sin[i] = 2 * amplitude * Math.sin(0.1 * i + t);
    }
    setSignal(sin);
    setSignalStr(sinString);
    if (psd) setPsd(webfftInstance.fft(psd));
  }, [amplitude]);

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
      </div>
    </section>
  );
}

export default InteractiveSignal;
