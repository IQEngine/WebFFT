import { expect, test } from "vitest";
import webfft from "../lib/main.js";

test("run profile", () => {
  const duration = 0.1;
  const fftsize = 1024;
  const fft = new webfft(fftsize);
  const start = performance.now();
  const profileObj = fft.profile(duration);
  const elapsed = (performance.now() - start) / 1e3;
  expect(elapsed).toBeGreaterThan(duration);
  expect(elapsed).toBeLessThan(duration * 1.2); // possibility for this to error in the future if run on a super slow machine
});
