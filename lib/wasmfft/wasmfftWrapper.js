import { getFFT, wasmBinary } from "./fft.js";

("use strict");

function intArrayFromBase64(s) {
    try {
        var decoded = atob(s);
        var bytes = new Uint8Array(decoded.length);
        for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i)
        }
        return bytes
    } catch (_) {
        throw new Error("Converting base64 string to bytes failed.")
    }
}

var module = new WebAssembly.Module(intArrayFromBase64(wasmBinary));

class WasmFftWrapperWasm {
    constructor(size) {
      this.size = size;
      
      this.instance = getFFT(module, size, "complex", "complex");
  
      this.inptr = this.instance.getInputBuffer();
      [this.outr, this.outi] = this.instance.getOutputBuffer();
    }
  
    fft = function (inputArray) {
      this.inptr.set(inputArray);
  
      this.instance.run();
  
      let outputArray = new Float32Array(this.size * 2);
      let [outr, outi] = [this.outr, this.outi];
      for (let i=0; i<this.size; i++) {
        outputArray[i*2] = outr[i];
        outputArray[i*2+1] = outi[i];
      }
      return outputArray;
    };
  
    dispose() {
      delete this.instance;
    }
  }
  
  export default WasmFftWrapperWasm;
  