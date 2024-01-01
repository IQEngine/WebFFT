# WebFFT

The Fastest Fourier Transform on the Web!

[Try it out](https://webfft.com/)

[Documentation](https://webfft.com/docs)

We welcome feedback via GitHub Issues and PRs!

## Overview

WebFFT is a metalibrary containing many FFT libraries, both javascript and webassembly based. We'll refer to these as sub-libraries.

There is a default sub-library that is used, but if you run

```javascript
import webfft from "webfft";
const fft = new webfft(1024);
fft.profile(); // optional arg sets number of seconds spent profiling
```

it will benchmark them all and use the best one for future calls.

As part of importing the library we will run a check to see if wasm is even supported, so the profiler and default can know which pool to pull from.

### Basic Usage

```javascript
const webfft = require('webfft');

// Instantiate
const fftsize = 1024; // must be power of 2
const fft = new webfft(fftsize);

// Profile
profileResults = fft.profile(); // results object can be used to make visualizations of the benchmarking results

// Create Input
const input = new Float32Array(2048); // interleaved complex array (IQIQIQIQ...), so it's twice the size
input.fill(0);

// Run FFT
const out = fft.fft(input); // out will be a Float32Array of size 2048
// or
const out = fft.fft(input, 'kissWasm');

fft.dispose(); // release Wasm memory
```

### 2D FFTs

WebFFT also supports 2D FFTs, using an array of arrays.
The inner arrays should be length 2*size and the outter array length should be a power of 2 but does not need to match the inner. 

```javascript
import webfft from "webfft";

const fftsize = 1024;
const outterSize = 128;
const fft = new webfft(fftsize);
let inputArr = [];
for (let j = 0; j < outterSize; j++) {
  const subArray = new Float32Array(fftsize * 2);
  for (let i = 0; i < fftsize * 2; i++) {
    subArray[i] = i * j * 1.12312312; // Arbitrary
  }
  inputArr.push(subArray); // add inner array
}
const out = fft.fft2d(inputArr);

fft.dispose(); // cleanup wasm
```

### Other Notes

Use fftr() for real-valued input, the output will still be complex but only the positive frequencies will be returned.

You don't have to pass fft/fftr/fft2d typed arrays, they can be regular javascript arrays.

Run unit tests with `npm run test`
