import { expect, test } from "vitest";
import webfft from "../lib/main.js";

test("fft2d validation", () => {
  const fftsize = 1024;
  const outterSize = 128;
  const fft = new webfft(fftsize, "indutnyJavascript");
  let inputArr = [];
  for (let j = 0; j < outterSize; j++) {
    const subArray = new Float32Array(fftsize * 2);
    for (let i = 0; i < fftsize * 2; i++) {
      subArray[i] = i * j * 1.12312312; // Arbitrary, but dont change or known correct sum will be wrong
    }
    inputArr.push(subArray);
  }
  const outputArr = fft.fft2d(inputArr);
  fft.dispose();

  // sum the mags
  let sum = 0;
  for (let i = 0; i < outterSize; i++) {
    for (let j = 0; j < fftsize; j++) {
      sum += Math.sqrt(
        outputArr[i][j * 2] * outputArr[i][j * 2] +
          outputArr[i][j * 2 + 1] * outputArr[i][j * 2 + 1],
      );
    }
  }

  console.log(outputArr[0][0]);

  expect(outputArr[0][0]).toBeCloseTo(9562834790.009773);
  expect(outputArr[0][1]).toBeCloseTo(9572182623.914913);

  expect(outputArr[100][2000]).toBeCloseTo(-2229791.2265142254);
  expect(outputArr[100][2001]).toBeCloseTo(-54740.244351726025);

  expect(sum).toBeCloseTo(311804931225.8735); // see below for how this number was found
});

/*
PYTHON USED TO GET CORRECT SUM

import numpy as np
fftsize = 1024
outterSize = 128
inputArr = np.zeros((outterSize, fftsize), np.complex64)
for j in range(outterSize):
  for i in range(fftsize):
    inputArr[j][i] = 2*i*j*1.12312312 + 1j*((2*i + 1) * j * 1.12312312)

out = np.fft.fft2(inputArr)

sum = 0
for i in range(outterSize):
  for j in range(fftsize):
    sum += np.abs(out[i][j])

print(sum)

*/
