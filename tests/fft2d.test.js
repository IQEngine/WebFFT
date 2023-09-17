import { expect, test } from "vitest";
import webfft from "../lib/main.js";

test("fft2d validation which also validates 1d fft values", () => {
  const fftsize = 1024;
  const outterSize = 128;
  
  
  let inputArr = [];
  for (let j = 0; j < outterSize; j++) {
    let subArray = new Float32Array(fftsize * 2);
    for (let i = 0; i < fftsize * 2; i++) {
      subArray[i] = Math.sin(i + j); // Arbitrary, but dont change or known correct sum will be wrong
    }
    inputArr.push(subArray);
  }

  const availableSubLibraries = fft.availableSubLibraries();
  for (let i = 0; i < availableSubLibraries.length; i++) {

  const fft = new webfft(fftsize, "nockertJavascript");

  const outputArr = fft.fft2d(inputArr);
  fft.dispose();

  expect(outputArr[0][0]).toBeCloseTo(0.1705339835898485, 3);
  expect(outputArr[0][1]).toBeCloseTo(-0.17611848087108228, 3);

  expect(outputArr[100][2000]).toBeCloseTo(-0.01635975610207374, 5);
  expect(outputArr[100][2001]).toBeCloseTo(0.9907842644470186, 5);

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
  expect(sum).toBeCloseTo(1039851.9120030339, 0); // see below for how this number was found
});

/*
PYTHON USED TO GET CORRECT SUM

import numpy as np
fftsize = 1024
outterSize = 128
inputArr = np.zeros((outterSize, fftsize), np.complex64)
for j in range(outterSize):
  for i in range(fftsize):
    real_part = np.sin((2*i) + j)
    imag_part = np.sin((2*i + 1) + j)
    inputArr[j][i] = real_part + 1j * imag_part

out = np.fft.fft2(inputArr)

sum = 0
for i in range(outterSize):
  for j in range(fftsize):
    sum += np.abs(out[i][j])

print(sum)
print(out[0][0])
print(out[100][1000])

>>> print(sum)
1039851.9120030339
>>> print(out[0][0])
(0.1705339835898485-0.17611848087108228j)
>>> print(out[100][1000])
(-0.01635975610207374+0.9907842644470186j)

*/
