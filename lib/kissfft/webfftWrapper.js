import KissFFTModule from "./KissFFT.mjs";

("use strict");

var kissFFTModule = await KissFFTModule({});

console.log("kissFFTModule:", kissFFTModule);

var kiss_fft_alloc = kissFFTModule.cwrap("kiss_fft_alloc", "number", [
  "number",
  "number",
  "number",
  "number",
]);

var kiss_fft = kissFFTModule.cwrap("kiss_fft", "void", [
  "number",
  "number",
  "number",
]);

var kiss_fft_free = kissFFTModule.cwrap("kiss_fft_free", "void", ["number"]);

class KissFftWrapperWasm {
  constructor(size) {
    this.size = size;
    this.fcfg = kiss_fft_alloc(this.size, false);
    this.icfg = kiss_fft_alloc(this.size, true);

    this.inptr = kissFFTModule._malloc(this.size * 8);

    this.cin = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      this.inptr,
      this.size * 2,
    );
  }

  fft = function (inputArray) {
    // TODO: figure out how to move this into the constructor without breaking things (unit tests will catch it)
    const outptr = kissFFTModule._malloc(this.size * 8);

    const cout = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      outptr,
      this.size * 2,
    );

    this.cin.set(inputArray);

    kiss_fft(this.fcfg, this.inptr, outptr);

    // we need to free the memory of outptr before we return, so we need this too
    let outputArray = new Float32Array(this.size * 2);
    outputArray.set(cout);

    kissFFTModule._free(outptr);

    return outputArray;
  };

  dispose() {
    kiss_fft_free(this.fcfg);
    kiss_fft_free(this.icfg);
    kissFFTModule._free(this.inptr);
  }
}

export default KissFftWrapperWasm;
