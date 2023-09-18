import { expect, test } from "vitest";
import webfft from "../lib/main.js";

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
  fft.dispose();
});

test("available sublibraries", () => {
  const fft = new webfft(1024);
  const availableSubLibraries = fft.availableSubLibraries();
  expect(availableSubLibraries.length).toBeGreaterThan(1);
  fft.dispose();
});

test("outputs for all sublibs approx match using different fftsizes", () => {
  const fftsizes = [
    4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
    16384, 32768, 65536, 131072,
  ];
  for (let j = 0; j < fftsizes.length; j++) {
    const fftsize = fftsizes[j];
    const fft = new webfft(fftsize);

    const availableSubLibraries = fft.availableSubLibraries();

    const inputArr = new Float32Array(fftsize * 2);
    for (let i = 0; i < fftsize * 2; i++) {
      inputArr[i] = i * 1.12312312; // Arbitrary
    }

    fft.setSubLibrary("indutnyJavascript");
    let co = fft.fft(inputArr);
    let goldenTotal = 0;
    for (let k = 0; k < fftsize; ++k) {
      goldenTotal += Math.sqrt(
        co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1],
      );
    }
    goldenTotal = goldenTotal / fftsize / fftsize;

    // Try each sub-library
    for (let i = 0; i < availableSubLibraries.length; i++) {
      fft.setSubLibrary(availableSubLibraries[i]);
      co = fft.fft(inputArr);
      let total = 0;
      for (let k = 0; k < fftsize; ++k) {
        total += Math.sqrt(
          co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1],
        );
      }
      total = total / fftsize / fftsize;
      expect(total).toBeCloseTo(goldenTotal, 5);
    }

    fft.dispose();
  }
});

test("fftr", () => {
  const fftsize = 1024;
  const fft = new webfft(fftsize);

  const availableSubLibraries = fft.availableSubLibraries();

  const inputArr = new Float32Array(fftsize);
  for (let i = 0; i < fftsize; i++) {
    inputArr[i] = i * 1.12312312; // Arbitrary
  }

  fft.setSubLibrary("indutnyJavascript");
  let co = fft.fftr(inputArr);
  let goldenTotal = 0;
  for (let k = 0; k < fftsize / 2; ++k) {
    goldenTotal += Math.sqrt(
      co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1],
    );
  }
  goldenTotal = goldenTotal / fftsize;

  // Try each sub-library
  for (let i = 0; i < availableSubLibraries.length; i++) {
    fft.setSubLibrary(availableSubLibraries[i]);
    co = fft.fftr(inputArr);
    let total = 0;
    for (let k = 0; k < fftsize / 2; ++k) {
      total += Math.sqrt(co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1]);
    }
    total = total / fftsize;
    expect(total).toBeCloseTo(goldenTotal, 3);
  }

  fft.dispose();
});

test("int16 inputs", () => {
  const fftsize = 1024;
  const fft = new webfft(fftsize);

  const availableSubLibraries = fft.availableSubLibraries();

  const inputArr = new Int16Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    inputArr[i] = i * 30; // Arbitrary
  }

  fft.setSubLibrary("indutnyJavascript");
  let co = fft.fft(inputArr);
  let goldenTotal = 0;
  for (let k = 0; k < fftsize; ++k) {
    goldenTotal += Math.sqrt(
      co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1],
    );
  }
  goldenTotal = goldenTotal / fftsize;

  // Try each sub-library
  for (let i = 0; i < availableSubLibraries.length; i++) {
    fft.setSubLibrary(availableSubLibraries[i]);
    co = fft.fft(inputArr);
    let total = 0;
    for (let k = 0; k < fftsize; ++k) {
      total += Math.sqrt(co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1]);
    }
    total = total / fftsize;
    expect(total).toBeCloseTo(goldenTotal, 1);
  }

  fft.dispose();
});

test("1000th element matches for all", () => {
  const fftsize = 1024;
  const fft = new webfft(fftsize);

  const availableSubLibraries = fft.availableSubLibraries();

  const inputArr = new Float32Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    inputArr[i] = i * 1.12312312; // Arbitrary
  }

  fft.setSubLibrary("indutnyJavascript");
  let co = fft.fft(inputArr);
  const goldenPhase = Math.atan(co[1000] / co[1001]);
  const goldenMag = Math.sqrt(co[1000] * co[1000] + co[1001] * co[1001]);

  // Try each sub-library
  for (let i = 0; i < availableSubLibraries.length; i++) {
    console.log("Testing", availableSubLibraries[i]);
    fft.setSubLibrary(availableSubLibraries[i]);

    co = fft.fft(inputArr);
    const phase = Math.atan(co[1000] / co[1001]);
    const mag = Math.sqrt(co[1000] * co[1000] + co[1001] * co[1001]);
    expect(phase).toBeCloseTo(goldenPhase, 5); // 2nd arg is the num digits after decimal point that must match
    expect(mag).toBeCloseTo(goldenMag, 2); // 2nd arg is the num digits after decimal point that must match
  }

  fft.dispose();
});
