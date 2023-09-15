/// <reference lib="webworker" />

import webfft, { ProfileResult } from "webfft";
import { MessageData } from "../types/types";

onmessage = (e: MessageEvent<MessageData | any>) => {
  const data = e.data;

  switch (data.type) {
    case "FFT_CALCULATION": {
      const { amplitude, frequency } = data;
      const fftSize = 1024; // Define fftSize before using it
      const sin = new Float32Array(2 * fftSize);

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

      const fft = new webfft(fftSize);
      const psd = fft.fft(sin);
      const mag = new Float32Array(fftSize);
      for (let i = 0; i < fftSize; i++) {
        mag[i] = Math.sqrt(
          psd[2 * i] * psd[2 * i] + psd[2 * i + 1] * psd[2 * i + 1],
        );
      }

      fft.dispose();

      self.postMessage({
        type: "FFT_RESULT",
        mag,
        sinString,
      });
      break;
    }

    case "PROFILE": {
      const { fftSize, duration } = data;
      const fft = new webfft(fftSize);
      const profileObj: ProfileResult = fft.profile(duration);
      fft.dispose();

      self.postMessage(profileObj);
      break;
    }

    default:
      console.error("Unknown message type:", data?.type);
  }
};
