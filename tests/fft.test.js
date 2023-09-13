import { expect, test } from "vitest";
import webfft from "../lib/index.js";

test("basic usage", () => {
  const fftsize = 1024;
  const fft = new webfft(fftsize);
  const inputArr = new Float32Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    inputArr[i] = i * 1.12312312; // Arbitrary
  }
  const outputArr = fft.fft(inputArr);
  expect(outputArr[0]).not.toBe(0);
  expect(outputArr.length).toBe(2 * fftsize);
});

test("available sublibraries", () => {
  const fft = new webfft(1024);
  const availableSubLibraries = fft.availableSubLibries();
  expect(availableSubLibraries.length).toBeGreaterThan(1);
});

test("outputs for all sublibs approx match", () => {
  const fftsize = 1024;
  const fft = new webfft(fftsize);

  const availableSubLibraries = fft.availableSubLibries();

  const inputArr = new Float32Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    inputArr[i] = i * 1.12312312; // Arbitrary
  }

  let co = fft.fft(inputArr, "indutnyJavascript");
  let goldenTotal = 0;
  for (let k = 0; k < fftsize; ++k) {
    goldenTotal += Math.sqrt(co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1]);
  }
  // goldenTotal will be 9147216.377928967

  // Try each sub-library
  for (let i = 0; i < availableSubLibraries.length; i++) {
    const subLib = availableSubLibraries[i];
    co = fft.fft(inputArr, subLib);
    let total = 0;
    for (let k = 0; k < fftsize; ++k) {
      total += Math.sqrt(co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1]);
    }
    console.log(total - goldenTotal);
    expect(Math.abs(total - goldenTotal)).toBeLessThan(0.9);
  }
});
