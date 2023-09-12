import KissFftWrapperWasm from "./kissfft/webfftWrapper.js";
import IndutnyFftWrapperJavascript from "./indutny/webfftWrapper.js";
import DntjWebFftWrapperJavascript from "./dntj/webfftWrapper.js";
import CrossFftWrapperWasm from "./cross/webfftWrapper.js";
import NayukiFftWrapperJavascript from "./nayuki/webfftWrapper.js";
import NayukiWasmFftWrapperWasm from "./nayukic/webfftWrapper.js";
import NockertFftWrapperJavascript from "./nockert/webfftWrapper.js";

class webfft {
  constructor(size) {
    this.size = size;
    this.outputArr = new Float32Array(2 * size);
    this.fftLibrary = undefined;
  }

  fft(inputArr, library) {
    var { size, outputArr, fftLibrary } = this;

    switch (library) {
      case "nayukiJavascript":
        fftLibrary = new NayukiFftWrapperJavascript(size);
        break;
      case "nayuki3Wasm":
        fftLibrary = new NayukiWasmFftWrapperWasm(size);
        break;
      case "kissWasm":
        fftLibrary = new KissFftWrapperWasm(size);
        break;
      case "crossWasm":
        fftLibrary = new CrossFftWrapperWasm(size);
        break;
      case "nockertJavascript":
        fftLibrary = new NockertFftWrapperJavascript(size);
        break;
      case "dntjJavascript":
        fftLibrary = DntjWebFftWrapperJavascript(size);
        break;
      case "indutnyJavascript":
        fftLibrary = new IndutnyFftWrapperJavascript(size);
        break;
      default:
        fftLibrary = new IndutnyFftWrapperJavascript(size);
    }

    outputArr = fftLibrary.fft(inputArr);
    return outputArr;
  }
}

module.exports = webfft;
