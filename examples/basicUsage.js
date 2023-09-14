import webfft from "../lib/main.js";
//import webfft from "webfft";
//const webfft = require("webfft");

// Complex-valued input
const fftsize = 1024;
const fft = new webfft(fftsize);
const inputArr = new Float32Array(fftsize * 2);
for (let i = 0; i < fftsize * 2; i++) {
  inputArr[i] = i * 1.12312312; // Arbitrary
}
const outputArr = fft.fft(inputArr);
console.log(outputArr);

// Real-valued input
const inputArrReal = new Float32Array(fftsize);
for (let i = 0; i < fftsize; i++) {
  inputArrReal[i] = i * 1.12312312; // Arbitrary
}
const outputArrReal = fft.fftr(inputArrReal);
console.log(outputArrReal);
