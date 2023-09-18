import FFTNayuki from "./fft.js"; // this one has the sin/cos tables precomputed

class NayukiFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.fftNayuki = new FFTNayuki(size);
  }

  fft(inputArr) {
    // it uses the same buffer for input and output
    const real = new Float32Array(this.size);
    const imag = new Float32Array(this.size);
    const outputArr = new Float32Array(this.size * 2);

    for (var i = 0; i < this.size; ++i) {
      real[i] = inputArr[i * 2];
      imag[i] = inputArr[i * 2 + 1];
    }
    this.fftNayuki.forward(real, imag); // this does the FFT, it uses the same buffer for input and output
    for (var i = 0; i < this.size; ++i) {
      outputArr[i * 2] = real[i];
      outputArr[i * 2 + 1] = imag[i];
    }
    return outputArr;
  }
}

export default NayukiFftWrapperJavascript;
