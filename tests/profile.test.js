import { expect, test } from "vitest";
import webfft from "../lib/main.js";

test("run profile", () => {
  const duration = 2; // dont reduce this, there was some wasm oom errors that didnt happen when it was at 0.5
  const fftsize = 1024;
  const fft = new webfft(fftsize);
  const start = performance.now();
  const profileObj = fft.profile(duration);
  const elapsed = (performance.now() - start) / 1e3;
  expect(elapsed).toBeGreaterThan(duration);
  expect(elapsed).toBeLessThan(duration * 1.5); // possibility for this to error in the future if run on a super slow machine
});

test("test local storage", () => {
  const duration = 2;
  const fftsize = 1024;
  const fft = new webfft(fftsize);
  const profileObj = fft.profile(duration);
  const profileObj2 = fft.profile(duration);
});

test("refresh set to false", () => {
  const fft = new webfft(1024);
  const profileObj = fft.profile(0.5);
  const profileObj2 = fft.profile(0.5, false);
});

// this one has to come last because it will wipe out localStorage for future tests
test("test when localStorage is undefined", () => {
  const duration = 2;
  const fftsize = 1024;
  localStorage = undefined;
  const fft = new webfft(fftsize);
  const profileObj = fft.profile(duration);
});

test("test checkBrowserCapabilities", () => {
  const fft = new webfft(1024);
  const ret = fft.checkBrowserCapabilities();
});

test("test dispose", () => {
  const fft = new webfft(1024, "kissWasm");
  fft.dispose();
});
