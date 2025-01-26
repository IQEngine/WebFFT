import KissFftWrapperWasm from "./kissfft/webfftWrapper.js";
import IndutnyFftWrapperJavascript from "./indutny/webfftWrapper.js";
//import DntjWebFftWrapperJavascript from "./dntj/webfftWrapper.js";
import CrossFftWrapperWasm from "./cross/webfftWrapper.js";
import NayukiFftWrapperJavascript from "./nayuki/webfftWrapper.js";
import NayukiWasmFftWrapperWasm from "./nayukic/webfftWrapper.js";
import NockertFftWrapperJavascript from "./nockert/webfftWrapper.js";
import MljsWebFftWrapperJavascript from "./mljs/webfftWrapper.js";
//import ViljaFftWrapperWasm from "./kissfftviljaNOTFINISHED/webfftWrapper.js";
import checkBrowserCapabilities from "./utils/checkCapabilities.js";
import KissFftModifiedWrapperWasm from "./kissfftmodified/webfftWrapper.js";
import IndutnyModifiedFftWrapperJavascript from "./indutnymodified/fft.js";
import WasmFftWrapperWasm from "./wasmfft/wasmfftWrapper.js";

const validSizes = [
  4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 16384,
  32768, 65536, 131072,
];

class webfft {
  constructor(size = 128, subLibrary = "indutnyJavascript", useProfile = true) {
    if (!validSizes.includes(size)) {
      throw new Error("Size must be a power of 2 between 4 and 131072");
    }
    this.size = size;
    this.outputArr = new Float32Array(2 * size);
    this.subLibrary = subLibrary;
    this.fftLibrary = undefined;
    const profile = this.getCurrentProfile();
    if (profile && useProfile) {
      this.setSubLibrary(profile.fastestSubLibrary);
    } else {
      this.setSubLibrary(subLibrary);
    }
  }

  availableSubLibraries() {
    return [
      "kissWasm",
      "indutnyModifiedJavascript",
      "indutnyJavascript",
      "crossWasm",
      "mljsJavascript",
      "nockertJavascript",
      "nayuki3Wasm",
      "nayukiJavascript",
      //"dntjJavascript", // need to figure out the precise scale factor before we can use this one, mainly due to unit tests
      "kissfftmodifiedWasm", // currently doesnt perform any better
      //"viljaWasm",
      "wasmfftWasm"
    ];
  }

  // A subset of the libraries known to be quickest, and removing ones that are too similar to others
  availableSubLibrariesQuick() {
    return ["kissWasm", "indutnyModifiedJavascript", "wasmfftWasm"];
  }

  getCurrentProfile() {
    // check if local storage is available
    if (typeof localStorage === "undefined") {
      return undefined;
    }
    if (!localStorage.getItem("webfftProfile")) {
      return undefined; // No profile
    }
    return JSON.parse(localStorage.getItem("webfftProfile"));
  }

  setSubLibrary(subLibrary) {
    switch (subLibrary) {
      case "nayukiJavascript":
        this.fftLibrary = new NayukiFftWrapperJavascript(this.size);
        break;
      case "nayuki3Wasm":
        this.fftLibrary = new NayukiWasmFftWrapperWasm(this.size);
        break;
      case "kissWasm":
        this.fftLibrary = new KissFftWrapperWasm(this.size);
        break;
      case "crossWasm":
        this.fftLibrary = new CrossFftWrapperWasm(this.size);
        if (this.size > 16384)
          this.fftLibrary = new IndutnyFftWrapperJavascript(this.size); // Cross throws "memory access out of bounds" for large sizes\
        break;
      case "nockertJavascript":
        this.fftLibrary = new NockertFftWrapperJavascript(this.size);
        break;
      //case "dntjJavascript":
      //  this.fftLibrary = new DntjWebFftWrapperJavascript(this.size);
      //  break;
      case "indutnyJavascript":
        this.fftLibrary = new IndutnyFftWrapperJavascript(this.size);
        break;
      case "mljsJavascript":
        this.fftLibrary = new MljsWebFftWrapperJavascript(this.size);
        break;
      case "kissfftmodifiedWasm":
        this.fftLibrary = new KissFftModifiedWrapperWasm(this.size);
        break;
      //case "viljaWasm":
      //  this.fftLibrary = new ViljaFftWrapperWasm(this.size);
      case "indutnyModifiedJavascript":
        this.fftLibrary = new IndutnyModifiedFftWrapperJavascript(this.size);
        break;
      case "wasmfftWasm":
        if (this.size < 8)
          this.fftLibrary = new IndutnyFftWrapperJavascript(this.size); // WasmFFT doesn't support sizes under 8
        else
          this.fftLibrary = new WasmFftWrapperWasm(this.size);
        break;
      default:
        //this.fftLibrary = new IndutnyFftWrapperJavascript(this.size);
        throw new Error("Invalid sublibrary");
    }
  }

  fft(inputArr) {
    if (inputArr.length !== 2 * this.size) {
      throw new Error("Input array length must be == 2 * size");
    }
    this.outputArr = this.fftLibrary.fft(inputArr);
    return this.outputArr;
  }

  // convinience function for people who want to use real-valued input.
  //   note that you still have to give it a size that is 2x your real-valued input length!!
  //   it doesn't actually speed it up by 2x
  //   output is complex but the lenght of inputArr because the negative freqs are removed
  fftr(inputArr) {
    var { outputArr, fftLibrary, size } = this;
    if (inputArr.length !== size) {
      throw new Error("Input array length must be == size");
    }
    const inputArrComplex = new Float32Array(2 * size);
    inputArrComplex.fill(0);
    for (let i = 0; i < size; i++) {
      inputArrComplex[2 * i] = inputArr[i];
    }
    outputArr = fftLibrary.fft(inputArrComplex);
    return outputArr.slice(size, size * 2);
  }

  // takes in an array of arrays each of length 2*size.  the outter array length must also be a power of two.  only supports complex
  fft2d(inputArray) {
    const innerLen = inputArray[0].length / 2;
    const outterLen = inputArray.length;

    if (innerLen !== this.size) {
      throw new Error("Inner array length must be == 2 * size");
    }
    if (!validSizes.includes(outterLen)) {
      throw new Error(
        "Outter array length must be a power of 2 between 4 and 131072",
      );
    }

    let intermediateArray = [];
    for (let i = 0; i < outterLen; i++) {
      this.outputArr = this.fft(inputArray[i]);
      intermediateArray.push(this.outputArr);
    }

    // change the sublibs fftsize to the outter
    this.dispose();
    this.size = outterLen;
    this.setSubLibrary(this.subLibrary); // this should reinitialize the sublib with the new size

    // normally at these point we would transpose the 2d array, but with javascript its easier to just incorporate it into the next step when we pull elements
    let finalArray = [];
    for (let i = 0; i < innerLen; i++) {
      const newArray = new Float32Array(2 * outterLen);
      newArray.fill(0);
      for (let j = 0; j < outterLen; j++) {
        newArray[2 * j] = intermediateArray[j][2 * i];
        newArray[2 * j + 1] = intermediateArray[j][2 * i + 1];
      }
      let temparray = new Float32Array(2 * outterLen);
      temparray = this.fft(newArray);
      finalArray.push(temparray);
    }

    // Now do a final transpose
    let outputArray = [];
    for (let i = 0; i < outterLen; i++) {
      let newArray = new Float32Array(2 * innerLen);
      for (let j = 0; j < innerLen; j++) {
        newArray[2 * j] = finalArray[j][2 * i];
        newArray[2 * j + 1] = finalArray[j][2 * i + 1];
      }
      outputArray.push(newArray);
    }

    // change back to original size
    this.dispose();
    this.size = innerLen;
    this.setSubLibrary(this.subLibrary); // this should reinitialize the sublib to the original size

    return outputArray;
  }

  profile(duration = 1, refresh = true, quick = false) {
    if (!refresh && this.getCurrentProfile()) {
      return this.getCurrentProfile();
    }
    const totalStart = performance.now();
    let subLibraries;
    if (quick) {
      subLibraries = this.availableSubLibrariesQuick();
    } else {
      subLibraries = this.availableSubLibraries();
    }
    let ffsPerSecond = [];
    const secondsPerRun = duration / subLibraries.length / 2; // split in half because of warmup
    for (let i = 0; i < subLibraries.length; i++) {
      this.setSubLibrary(subLibraries[i]);

      // Create input array
      const ci = new Float32Array(2 * this.size);
      for (let j = 0; j < this.size; j++) {
        ci[2 * j] = Math.random() - 0.5;
        ci[2 * j + 1] = Math.random() - 0.5;
      }

      // Warmup
      let start = performance.now();
      while ((performance.now() - start) / 1e3 < secondsPerRun) {
        const co = this.fft(ci);
      }

      // Benchmark
      start = performance.now();
      let numFfts = 0;
      while ((performance.now() - start) / 1e3 < secondsPerRun) {
        const co = this.fft(ci);
        numFfts++;
      }
      ffsPerSecond.push((1e3 * numFfts) / (performance.now() - start));

      this.dispose();
    }
    const totalElapsed = (performance.now() - totalStart) / 1e3;

    // Update current FFT method
    let argmax = ffsPerSecond.indexOf(Math.max(...ffsPerSecond));

    const profileObj = {
      fftsPerSecond: ffsPerSecond,
      subLibraries: subLibraries,
      totalElapsed: totalElapsed,
      fastestSubLibrary: subLibraries[argmax],
    };

    console.log("Setting sublibrary to", profileObj.fastestSubLibrary);
    this.setSubLibrary(profileObj.fastestSubLibrary);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("webfftProfile", JSON.stringify(profileObj));
    }
    return profileObj;
  }

  async checkBrowserCapabilities() {
    return await checkBrowserCapabilities();
  }

  dispose() {
    if (this.fftLibrary && this.fftLibrary.dispose !== undefined) {
      this.fftLibrary.dispose();
    }
  }
}

export default webfft;
