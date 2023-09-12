// Adapted from https://github.com/j-funk/js-dsp-test
// Nice comparison in https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/

import isaacCSPRNG from "./isaacCSPRNG.js";
import KissFftWrapperWasm from "./kissfft/webfftWrapper.js";
import IndutnyFftWrapperJavascript from "./indutny/webfftWrapper.js";
import DntjWebFftWrapperJavascript from "./dntj/webfftWrapper.js";
import CrossFftWrapperWasm from "./cross/webfftWrapper.js";
import NayukiFftWrapperJavascript from "./nayuki/webfftWrapper.js";
import NayukiWasmFftWrapperWasm from "./nayukic/webfftWrapper.js";
import NockertFftWrapperJavascript from "./nockert/webfftWrapper.js";

const num_trials = 1000;
const fftSize = 1024; //16384;

const subLibraries = [
  KissFftWrapperWasm,
  IndutnyFftWrapperJavascript,
  CrossFftWrapperWasm,
  NayukiWasmFftWrapperWasm,
  NockertFftWrapperJavascript,
  NayukiFftWrapperJavascript,
  DntjWebFftWrapperJavascript,
];

window.onload = function () {
  let test_names = [];
  let results = [];
  let totals = [];
  let barColors = [];
  for (let i = 0; i < subLibraries.length; i++) {
    console.log("Starting", subLibraries[i].name);
    const subLibrary = new subLibraries[i](fftSize);

    // Create input array
    let prng = isaacCSPRNG("this is a seed for rng!");
    const ci = new Float32Array(2 * fftSize);
    for (let j = 0; j < fftSize; j++) {
      ci[2 * j] = prng.random() / 2.0;
      ci[2 * j + 1] = prng.random() / 2.0;
    }

    // Warmup
    for (let j = 0; j < num_trials; ++j) subLibrary.fft(ci);

    // Benchmark
    const start = performance.now();
    let total = 0.0;
    for (let j = 0; j < num_trials; ++j) {
      const co = subLibrary.fft(ci);
      for (let k = 0; k < fftSize; ++k) {
        total += Math.sqrt(co[k * 2] * co[k * 2] + co[k * 2 + 1] * co[k * 2 + 1]);
      }
    }
    const end = performance.now();
    const elapsed = end - start;

    console.log(total);
    const ffts_per_second = 1000.0 / (elapsed / num_trials);
    if (subLibraries[i].name.includes("Javascript")) {
      test_names.push(subLibraries[i].name.split("Javascript")[0]);
      barColors.push("rgba(255,0,0,0.7)");
    } else if (subLibraries[i].name.includes("Wasm")) {
      test_names.push(subLibraries[i].name.split("Wasm")[0]);
      barColors.push("rgba(0,0,255,0.7)");
    } else {
      console.error("all sublibraries should end in Javascript or Wasm");
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
      marker: { color: barColors },
    },
  ];

  const layout = {
    title: "Comparison of FFTs in Javascript and WebAssembly",
    yaxis: {
      title: {
        text: "FFTs per Second",
        font: {
          family: "sans serif",
          size: 18,
        },
      },
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
          color: "rgba(255,0,0,1)",
        },
      },
      {
        x: 1,
        y: Math.max.apply(Math, yArray) * 1.3,
        text: "WebAssembly",
        showarrow: false,
        font: {
          family: "sans serif",
          size: 18,
          color: "rgba(0,0,255,1)",
        },
      },
    ],
  };

  Plotly.newPlot("myPlot", data, layout);
};
