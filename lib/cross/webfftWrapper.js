import FFTCross from "./FFT.js";

class CrossFftWrapperWasm {
  constructor(size) {
    this.size = size;
    this.fftcross = new FFTCross(size);
    this.real = new Float64Array(this.size);
    this.imag = new Float64Array(this.size);
  }

  fft(inputArr) {
    for (var i = 0; i < this.size; i++) {
      this.real[i] = inputArr[2 * i];
      this.imag[i] = inputArr[2 * i + 1];
    }
    const out = this.fftcross.transform(this.real, this.imag, false);
    const outputArr = new Float32Array(2 * this.size);
    for (var i = 0; i < this.size; i++) {
      outputArr[2 * i] = out.real[i];
      outputArr[2 * i + 1] = out.imag[i];
    }
    return outputArr;
  }
}

export default CrossFftWrapperWasm;
