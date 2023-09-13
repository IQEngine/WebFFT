import FFT from "./fftlib.js";

class MljsWebFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.input_real = new Float32Array(size);
    this.input_imag = new Float32Array(size);
    this.outputArr = new Float32Array(2 * size);

    this.FFT_mljs = FFT;
    this.FFT_mljs.init(size);
  }

  fft(inputArr) {
    for (var i = 0; i < this.size; ++i) {
      this.input_real[i] = inputArr[i * 2];
      this.input_imag[i] = inputArr[i * 2 + 1];
    }
    this.FFT_mljs.fft(this.input_real, this.input_imag); // performs fft in-place
    for (var i = 0; i < this.size; ++i) {
      this.outputArr[i * 2] = this.input_real[i];
      this.outputArr[i * 2 + 1] = this.input_imag[i];
    }
    return this.outputArr;
  }
}

export default MljsWebFftWrapperJavascript;
