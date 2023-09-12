import KissFftWrapperWasm from "./library/kissfft/webfftWrapper.js";
import IndutnyFftWrapperJavascript from "./library/indutny/webfftWrapper.js";
import DntjWebFftWrapperJavascript from "./library/dntj/webfftWrapper.js";
//import CrossFftWrapperWasm from "./library/cross/webfftWrapper.js";
import NayukiFftWrapperJavascript from "./library/nayuki/webfftWrapper.js";
//import NayukiWasmFftWrapperWasm from "./library/nayukic/webfftWrapper.js";
import NockertFftWrapperJavascript from "./library/nockert/webfftWrapper.js";

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
      //case "nayuki3Wasm":
      //  fftLibrary = new NayukiWasmFftWrapperWasm(size);
      //  break;
      case "kissWasm":
        fftLibrary = new KissFftWrapperWasm(size);
        break;
      //case "crossWasm":
      //  fftLibrary = new CrossFftWrapperWasm(size);
      //  break;
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

//module.exports = webfft;

export default webfft;
