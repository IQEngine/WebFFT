import FFT from "./complex.js";

class NockertFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.nockertfft = new FFT.complex(size, false); // 2nd arg is for inverse
    this.outputArr = new Float32Array(2 * size);
  }

  fft(inputArr) {
    this.nockertfft.simple(this.outputArr, inputArr, "complex");
    return this.outputArr;
  }
}

export default NockertFftWrapperJavascript;
