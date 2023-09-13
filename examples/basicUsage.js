import webfft from "../lib/index.js";
//import webfft from "webfft";
//const webfft = require("webfft");

const fftsize = 1024;
const fft = new webfft(fftsize);

const inputArr = new Float32Array(fftsize * 2);
for (let i = 0; i < fftsize * 2; i++) {
  inputArr[i] = i * 1.12312312; // Arbitrary
}

const outputArr = fft.fft(inputArr);

console.log(outputArr);
