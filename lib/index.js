import KissFftWrapperWasm from "./kissfft/webfftWrapper.js";
import IndutnyFftWrapperJavascript from "./indutny/webfftWrapper.js";
import DntjWebFftWrapperJavascript from "./dntj/webfftWrapper.js";
import CrossFftWrapperWasm from "./cross/webfftWrapper.js";
import NayukiFftWrapperJavascript from "./nayuki/webfftWrapper.js";
import NayukiWasmFftWrapperWasm from "./nayukic/webfftWrapper.js";
import NockertFftWrapperJavascript from "./nockert/webfftWrapper.js";
import MljsWebFftWrapperJavascript from "./mljs/webfftWrapper.js";

const validSizes = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 16384, 32768, 65536, 131072];

class webfft {
  constructor(size, subLibrary = "indutnyJavascript", useProfile = true) {
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
        if (this.size > 16384) this.fftLibrary = new IndutnyFftWrapperJavascript(this.size); // Cross throws "memory access out of bounds" for large sizes\
        break;
      case "nockertJavascript":
        this.fftLibrary = new NockertFftWrapperJavascript(this.size);
        break;
      case "dntjJavascript":
        this.fftLibrary = new DntjWebFftWrapperJavascript(this.size);
        break;
      case "indutnyJavascript":
        this.fftLibrary = new IndutnyFftWrapperJavascript(this.size);
        break;
      case "mljsJavascript":
        this.fftLibrary = new MljsWebFftWrapperJavascript(this.size);
        break;
      default:
        this.fftLibrary = new IndutnyFftWrapperJavascript(this.size);
    }
  }

  fft(inputArr) {
    var { outputArr, fftLibrary } = this;
    if (inputArr.length !== 2 * this.size) {
      throw new Error("Input array length must be 2 * size");
    }
    outputArr = fftLibrary.fft(inputArr);
    return outputArr;
  }

  availableSubLibraries() {
    return [
      "indutnyJavascript",
      "nockertJavascript",
      "nayukiJavascript",
      "nayuki3Wasm",
      "kissWasm",
      "crossWasm",
      "dntjJavascript",
      "mljsJavascript"
    ];
  }

  profile(duration = 1, refresh = false) {
    if (!refresh && this.getCurrentProfile()) {
      return this.getCurrentProfile();
    }
    const totalStart = performance.now();
    const subLibraries = this.availableSubLibraries();
    let ffsPerSecond = [];
    const secondsPerRun = duration / subLibraries.length / 2; // split in half because of warmup
    for (let i = 0; i < subLibraries.length; i++) {
      //console.log("Starting", subLibraries[i]);
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
      ffsPerSecond.push(numFfts / (performance.now() - start));
    }
    const totalElapsed = (performance.now() - totalStart) / 1e3;

    // Update current FFT method
    let argmax = ffsPerSecond.indexOf(Math.max(...ffsPerSecond));

    const profileObj = {
      ffsPerSecond: ffsPerSecond,
      subLibraries: subLibraries,
      totalElapsed: totalElapsed,
      fastestSubLibrary: subLibraries[argmax]
    };

    console.log("Setting sublibrary to", profileObj.fastestSubLibrary);
    this.setSubLibrary(profileObj.fastestSubLibrary);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("webfftProfile", JSON.stringify(profileObj));
    }
    return profileObj;
  }
}

export default webfft;
