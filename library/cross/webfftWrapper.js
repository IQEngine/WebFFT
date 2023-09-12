import FFTCross from "./FFT.js";

class CrossFftWrapperWasm {
  constructor(size) {
    this.size = size;
    this.fftcross = new FFTCross(size);
    this.outputArr = new Float32Array(2 * size);
    this.real = new Float64Array(this.size);
    this.imag = new Float64Array(this.size);
  }

  fft(inputArr) {
    for (var i = 0; i < this.size; i++) {
      this.real[i] = inputArr[2 * i];
      this.imag[i] = inputArr[2 * i + 1];
    }
    const out = this.fftcross.transform(this.real, this.imag, false);
    for (var i = 0; i < this.size; i++) {
      this.outputArr[2 * i] = out.real[i];
      this.outputArr[2 * i + 1] = out.imag[i];
    }
    return this.outputArr;
  }
}

export default CrossFftWrapperWasm;
