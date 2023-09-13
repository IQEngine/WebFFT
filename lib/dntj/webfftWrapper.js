import { FFT } from "./fft.js";
import { ComplexArray } from "./complex_array.js";

class DntjWebFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.outputArr = new Float32Array(2 * size);
    this.cin = new ComplexArray(size);
    this.scale = Math.sqrt(size);
  }

  fft(inputArr) {
    for (var i = 0; i < this.size; ++i) {
      this.cin.real[i] = inputArr[i * 2];
      this.cin.imag[i] = inputArr[i * 2 + 1];
    }
    const co = this.cin.FFT();
    for (var i = 0; i < this.size; ++i) {
      this.outputArr[i * 2] = co.real[i] * this.scale;
      this.outputArr[i * 2 + 1] = co.imag[i] * this.scale;
    }
    return this.outputArr;
  }
}

export default DntjWebFftWrapperJavascript;
