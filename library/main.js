// Adapted from https://github.com/j-funk/js-dsp-test
// Nice comparison in https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/

import isaacCSPRNG from "./isaacCSPRNG.js";
import wrappedKissFFT from "./kissfft/webfftWrapper.js";
import IndutnyFftWrapper from "./indutny/webfftWrapper.js";
import DntjWebFftWrapper from "./dntj/webfftWrapper.js";
import CrossFftWrapper from "./cross/webfftWrapper.js";
import NayukiFftWrapper from "./nayuki/webfftWrapper.js";
import NayukiWasmFftWrapper from "./nayukic/webfftWrapper.js";
import NockertFftWrapper from "./nockert/webfftWrapper.js";

var num_trials = 1000;
var fftSize = 1024; //16384;
const seed = "this is a seed for rng!";

// interleaved complex (produces 2x the output as genInputReal32 for a given size)
function genInputComplex32(size) {
  let prng = isaacCSPRNG(seed);
  var result = new Float32Array(2 * size);
  for (var i = 0; i < size; i++) {
    result[2 * i] = prng.random() / 2.0;
    result[2 * i + 1] = prng.random() / 2.0;
  }
  return result;
}

//===============
// Start of FFTs
//===============

// pure javascript but with sin/cos tables precomputed, double precision, in-place, feeding it single seems to work fine
function nayuki1Javascript(size) {
  var fft = new NayukiFftWrapper(size);
  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = fft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

// wasm with sin/cos tables precomputed, SINGLE precision, in-place
function nayuki2Wasm(size) {
  var fft = new NayukiWasmFftWrapper(size);
  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = fft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

// fft.js by Jens Nockert (nockert), pure javascript, double precision but feeding it single seems to work fine
function nockertJavascript(size) {
  var fft = new NockertFftWrapper(size);
  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = fft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

// another fft.js (one used in iqengine) by indutny, pure javascript
function indutnyJavascript(size) {
  var fft = new IndutnyFftWrapper(size);
  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = fft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

// jsfft by Nick Jones (dntj), javascript, single precision
function dntjJavascript(size) {
  var fft = new DntjWebFftWrapper(size);
  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    var co = fft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

// wasm, double precision
function crossWasm(size) {
  var fft = new CrossFftWrapper(size);

  var ci = genInputComplex32(size);

  for (var i = 0; i < num_trials; ++i) fft.fft(ci); // Warmup

  var start = performance.now();
  var total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = fft.fft(ci); // last arg is inverse
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();
  return [end - start, total];
}

function kissWasm(size) {
  const kissfft = new wrappedKissFFT(size);
  const ci = genInputComplex32(size);

  // warmup
  for (var i = 0; i < num_trials; ++i) kissfft.fft(ci);

  var start = performance.now();
  let total = 0.0;
  for (var i = 0; i < num_trials; ++i) {
    const co = kissfft.fft(ci);
    for (var j = 0; j < size; ++j) {
      total += Math.sqrt(co[j * 2] * co[j * 2] + co[j * 2 + 1] * co[j * 2 + 1]);
    }
  }
  var end = performance.now();

  kissfft.dispose();

  return [end - start, total];
}

var tests = [nayuki1Javascript, nayuki2Wasm, kissWasm, crossWasm, nockertJavascript, dntjJavascript, indutnyJavascript];

window.onload = function () {
  let test_names = [];
  let results = [];
  let totals = [];
  let barColors = [];
  for (let i = 0; i < tests.length; i++) {
    console.log("Starting", tests[i].name);
    const [elapsed, total] = tests[i](fftSize);
    console.log(total);
    const ffts_per_second = 1000.0 / (elapsed / num_trials);
    if (tests[i].name.includes("Javascript")) {
      test_names.push(tests[i].name.split("Javascript")[0]);
      barColors.push("rgba(255,0,0,0.7)");
    } else {
      test_names.push(tests[i].name.split("Wasm")[0]);
      barColors.push("rgba(0,0,255,0.7)");
    }
    results.push(ffts_per_second);
    totals.push(total);
  }

  // Plotly stuff
  const xArray = test_names;
  const yArray = results;

  const data = [
    {
      x: xArray,
      y: yArray,
      type: "bar",
      marker: { color: barColors }
    }
  ];

  const layout = {
    title: "Comparison of FFTs in Javascript and WebAssembly",
    yaxis: {
      title: {
        text: "FFTs per Second",
        font: {
          family: "sans serif",
          size: 18
        }
      }
    },
    annotations: [
      {
        x: 1,
        y: Math.max.apply(Math, yArray) * 1.2,
        text: "JavaScript",
        showarrow: false,
        font: {
          family: "sans serif",
          size: 18,
          color: "rgba(255,0,0,1)"
        }
      },
      {
        x: 1,
        y: Math.max.apply(Math, yArray) * 1.3,
        text: "WebAssembly",
        showarrow: false,
        font: {
          family: "sans serif",
          size: 18,
          color: "rgba(0,0,255,1)"
        }
      }
    ]
  };

  Plotly.newPlot("myPlot", data, layout);
};
