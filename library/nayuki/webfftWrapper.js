import transform from "./fft.js";

class NayukiFftWrapper {
  constructor(size) {
    this.size = size;
    // it uses the same buffer for input and output
    this.real = new Float32Array(size);
    this.imag = new Float32Array(size);
    this.outputArr = new Float32Array(size * 2);
  }

  fft(inputArr) {
    for (var i = 0; i < this.size; ++i) {
      this.real[i] = inputArr[i * 2];
      this.imag[i] = inputArr[i * 2 + 1];
    }
    transform(this.real, this.imag); // this does the FFT, it uses the same buffer for input and output
    for (var i = 0; i < this.size; ++i) {
      this.outputArr[i * 2] = this.real[i];
      this.outputArr[i * 2 + 1] = this.imag[i];
    }
    return this.outputArr;
  }
}

export default NayukiFftWrapper;
