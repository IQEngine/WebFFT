import { fft } from "kissfft-wasm";

class ViljaFftWrapperWasm {
  constructor(size) {
    // vilja doesnt have a constructor
    this.outputArr = new Float32Array(2 * size);
  }

  fft(inputArr) {
    return fft(inputArr);
  }
}

export default ViljaFftWrapperWasm;
