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

    this.fcfg = kiss_fft_alloc(size, false);
    this.icfg = kiss_fft_alloc(size, true);

    this.inptr = kissFFTModule._malloc(size * 8 + size * 8);
    this.outptr = this.inptr + size * 8;

    this.cin = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      this.inptr,
      size * 2,
    );
    this.cout = new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      this.outptr,
      size * 2,
    );
  }

  fft = function (cin) {
    this.cin.set(cin);
    kiss_fft(this.fcfg, this.inptr, this.outptr);
    return new Float32Array(
      kissFFTModule.HEAPU8.buffer,
      this.outptr,
      this.size * 2,
    );
  };

  destructor() {
    kissFFTModule._free(this.inptr);
    kiss_fft_free(this.fcfg);
    kiss_fft_free(this.icfg);
  }
}

export default KissFftWrapperWasm;
