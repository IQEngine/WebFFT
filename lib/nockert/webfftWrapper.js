import FFT from "./complex.js";

class NockertFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.nockertfft = new FFT.complex(size, false); // 2nd arg is for inverse
  }

  fft(inputArr) {
    const outputArr = new Float32Array(2 * this.size);
    this.nockertfft.simple(outputArr, inputArr, "complex");
    return outputArr;
  }
}

export default NockertFftWrapperJavascript;
