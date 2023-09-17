import KissFFTModule from "./KissFFT.js";

("use strict");

var kissFFTModule = KissFFTModule({});

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
  }

  fft = function (inputArray) {
    // TODO: figure out how to move this stuff into the constructor without breaking things (unit tests will catch it)
    const fcfg = kiss_fft_alloc(this.size, false);
    const icfg = kiss_fft_alloc(this.size, true);

    const inptr = kissFFTModule._malloc(this.size * 8 + this.size * 8);
    const outptr = this.inptr + this.size * 8;

    const cin = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      inptr,
      this.size * 2,
    );

    const cout = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      outptr,
      this.size * 2,
    );

    //cin.set(inputArray);

    kiss_fft(this.fcfg, this.inptr, this.outptr);

    kissFFTModule._free(inptr);
    kiss_fft_free(fcfg);
    kiss_fft_free(icfg);

    return cout;
  };

  destructor() {}
}

export default KissFftWrapperWasm;
