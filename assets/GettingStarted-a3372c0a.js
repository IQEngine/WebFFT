import{j as e}from"./index-d9682b1d.js";function r(t){const n=Object.assign({h2:"h2",p:"p",pre:"pre",code:"code",h3:"h3"},t.components);return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Overview"}),`
`,e.jsx(n.p,{children:"WebFFT is a metalibrary containing many FFT libraries, both javascript and webassembly based. We'll refer to these as sub-libraries."}),`
`,e.jsx(n.p,{children:"There is a default sub-library that is used, but if you run"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`import webfft from "webfft";
const fft = new webfft(1024);
fft.profile(); // optional arg sets number of seconds spent profiling
`})}),`
`,e.jsx(n.p,{children:"it will benchmark them all and use the best one for future calls."}),`
`,e.jsx(n.p,{children:"As part of importing the library we will run a check to see if wasm is even supported, so the profiler and default can know which pool to pull from."}),`
`,e.jsx(n.h3,{children:"Basic Usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`const webfft = require('webfft');

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
`})}),`
`,e.jsx(n.h3,{children:"2D FFTs"}),`
`,e.jsx(n.p,{children:`WebFFT also supports 2D FFTs, using an array of arrays.
The inner arrays should be length 2*size and the outter array length should be a power of 2 but does not need to match the inner.`}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`import webfft from "webfft";

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
`})}),`
`,e.jsx(n.h3,{children:"Other Notes"}),`
`,e.jsx(n.p,{children:"Use fftr() for real-valued input, the output will still be complex but only the positive frequencies will be returned."}),`
`,e.jsx(n.p,{children:"You don't have to pass fft/fftr/fft2d typed arrays, they can be regular javascript arrays."})]})}function a(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,Object.assign({},t,{children:e.jsx(r,t)})):r(t)}export{a as default};
