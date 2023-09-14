// Adapted from https://github.com/j-funk/js-dsp-test
// Nice comparison in https://thebreakfastpost.com/2015/10/18/ffts-in-javascript/

import webfft from "./index.js";
import sortDescending from "./utils/sortPerformance.js";
import checkBrowserCapabilities from "./utils/checkCapabilities.js";

// Check for Wasm and SIMD support
checkBrowserCapabilities().then((capabilities) => {
  console.log(`Capabilities: ${JSON.stringify(capabilities)}`);
});

window.onload = function () {
  const duration = 0.1;
  const fftsize = 1024;
  const fft = new webfft(fftsize);

  const profileObj = fft.profile(duration);
  console.log(profileObj);

  let results = profileObj.ffsPerSecond;

  let test_names = [];
  let barColors = [];
  for (let i = 0; i < profileObj.subLibraries.length; i++) {
    if (profileObj.subLibraries[i].includes("Javascript")) {
      test_names.push(profileObj.subLibraries[i].split("Javascript")[0]);
      barColors.push("rgba(255,0,0,0.7)");
    } else if (profileObj.subLibraries[i].includes("Wasm")) {
      test_names.push(profileObj.subLibraries[i].split("Wasm")[0]);
      barColors.push("rgba(0,0,255,0.7)");
    } else {
      console.error("all sublibraries should end in Javascript or Wasm");
    }
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

  Plotly.newPlot("myPlot", sortDescending(data), layout);
};
