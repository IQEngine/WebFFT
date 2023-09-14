import webfft from "../lib/main.js";
//import webfft from "webfft";
//const webfft = require("webfft");

const fftsize = 1024;
const fft = new webfft(fftsize);
const profileObj = fft.profile(2); // duration to run profile, in seconds
console.log(profileObj);
console.log("Fastest sub-library:", profileObj.fastestSubLibrary);

// get it from local storage
if (typeof localStorage !== "undefined") {
  const profileObjLocal = JSON.parse(localStorage.getItem("webfftProfile"));
  console.log(profileObjLocal);
  console.log("Fastest sub-library:", profileObjLocal.fastestSubLibrary);
}

// it will automatically set future .fft() calls to use whichever was fastest
