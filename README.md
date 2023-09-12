# WebFFT

The Fastest Fourier Transform on the Web!

## API

Our library is essentially a metalibrary containing many FFT libraries, both javascript and webassembly based. We'll refer to these as sub-libraries.

There will be a default sub-library that is used, but if you run `profile()`, it will benchmark them all and use the best for future calls.

As part of importing the library we will run a check to see if wasm is even supported, so the profiler and default can know which pool to pull from.

### Basic Usage

```javascript
const webfft = require('webfft'); // or do we need something like https://github.com/AWSM-WASM/PulseFFT#instantiate-pulse

// Instantiate
const fftsize = 1024; // must be power of 2
const fft = new webfft(fftsize); // provide size.  assumed to be complex

// Profile
fft.profile(); // optional params like number of trials or how long to spend profiling
// or
profileResults = fft.profile(); // profile results object can be used to make visualizations of the benchmarking results
console.log("Best one:", profileResults[0]['SubLibraryName']);

// (will likely be tweaked later) profileResults object/list, in order of speed:
/*
[{'SubLibraryName': 'indutny', 'fftsPerSecond': 10.34},
 {'SubLibraryName': 'indutny', 'fftsPerSecond': 8.34} 
...]
*/

// Create Input
const input = new Float32Array(2048); // interleaved complex array (IQIQIQIQ...), so it's twice the size
input.fill(0);

// Run FFT
const out = fft.fft(input); // out will be a Float32Array of size 2048
// or
const out = fft.fft(input, 'indutny');
//or 
const out = fft.fft(input, profileResults[0]['SubLibraryName']); // profileResults obj will likely be changed later

```

### Sub-Library API

We'll use the same out = x.fft(in) approach for the API used internally, to call individual sub-libraries.  

A file webfftWrapper.js will exist in all sub-library dirs, so that we can avoid modifying the actual sub-library code, making it easier to update them if need be.

## Existing web FFT libs

### Javascript-Based

- fft.js aka indutny
  - https://github.com/indutny/fft.js/ (last changed 2021)
  - What IQEngine used before WebFFT
- fft-js aka vail
  - https://www.npmjs.com/package/fft-js
  - https://github.com/vail-systems/node-fft (last changed 2019)
- jsfft aka dntj
  - https://github.com/dntj/jsfft (last changed 2019)
- fourier-transform
  - https://github.com/scijs/fourier-transform (last changed 2018)
  - author compared it to several others https://github.com/scijs/fourier-transform/blob/master/benchmark.md
- ndarray-fft
  - https://github.com/scijs/ndarray-fft (last changed 2016)
- DSP.js
  - https://github.com/corbanbrook/dsp.js (no longer maintained but last changed 2022)
- digitalsignals (fork of DSP.js)
  - https://github.com/zewemli/dsp.js (last changed 2014)
- fourier
  - https://github.com/drom/fourier (last changed 2021)
- ml-fft
  - https://github.com/mljs/fft (last changed 2020)
- Nockert
  - https://github.com/auroranockert/fft.js
  - not on npm

### WebAssembly-based

- PulseFFT
  - https://github.com/AWSM-WASM/PulseFFT (last change in 2018)
  - KissFFT based
- kissfft-wasm
  - https://github.com/iVilja/kissfft-wasm (last change Oct 2022)
  - KissFFT based
- Mozilla's implementation used in webkit audio
  - appears to be a copy of kissFFT
  - https://github.com/mozilla/gecko-dev/tree/6dd16cb77552c7cec8ab7e4e3b74ca7d5e320339/media/kiss_fft
- fftw-js
  - FFTW (extremely popular for desktop) ported with webasm
  - https://github.com/j-funk/fftw-js
  - GPL licensed!!!
- pffft.wasm
  - https://github.com/JorenSix/pffft.wasm (last change June 2022)
  - SIMD support

### How to build and run our benchmarks

1. `npm install`
2. `npm run build`
3. `npm install --global serve`
4. `serve library -l 8080`
5. Open your browser to http://localhost:8080 

### Other people's benchmarks and comparisons

- https://github.com/j-funk/js-dsp-test
- https://github.com/scijs/fourier-transform/blob/HEAD/benchmark.md
- https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/
- https://toughengineer.github.io/demo/dsp/fft-perf/
