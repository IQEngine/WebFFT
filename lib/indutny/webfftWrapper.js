import FFT_indutny from "./fft.js";

class IndutnyFftWrapperJavascript {
  constructor(size) {
    this.size = size;
    this.indutnyFft = new FFT_indutny(size);
  }

  fft(inputArr) {
    const outputArr = new Float32Array(2 * this.size);
    this.indutnyFft.transform(outputArr, inputArr);
    return outputArr;
  }
}

export default IndutnyFftWrapperJavascript;
