import FFT_indutny from "./fft.js";

class IndutnyModifiedFftWrapperJavascript {
  constructor(size) {
    this.indutnyFft = new FFT_indutny(size);
  }

  fft(inputArr) {
    return this.indutnyFft.transform(inputArr);
  }
}

export default IndutnyModifiedFftWrapperJavascript;
