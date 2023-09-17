import FFT from "./fftlib.js";

class MljsWebFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.FFT_mljs = FFT;
    this.FFT_mljs.init(size);
  }

  fft(inputArr) {
    const input_real = new Float32Array(this.size);
    const input_imag = new Float32Array(this.size);
    const outputArr = new Float32Array(2 * this.size);

    for (var i = 0; i < this.size; ++i) {
      input_real[i] = inputArr[i * 2];
      input_imag[i] = inputArr[i * 2 + 1];
    }

    this.FFT_mljs.fft(input_real, input_imag); // performs fft in-place

    for (var i = 0; i < this.size; ++i) {
      outputArr[i * 2] = input_real[i];
      outputArr[i * 2 + 1] = input_imag[i];
    }
    return outputArr;
  }
}

export default MljsWebFftWrapperJavascript;
