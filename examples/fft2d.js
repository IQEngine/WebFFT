import webfft from "../lib/main.js";
//import webfft from "webfft";
//const webfft = require("webfft");

const fftsize = 1024;
const outterSize = 128;
const fft = new webfft(fftsize);
let inputArr = [];
for (let j = 0; j < outterSize; j++) {
  const subArray = new Float32Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    subArray[i] = i * j * 1.12312312; // Arbitrary
  }
  inputArr.push(subArray);
}
const out = fft.fft2d(inputArr);

fft.dispose();
