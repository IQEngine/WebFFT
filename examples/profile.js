import webfft from "../lib/index.js";
//import webfft from "webfft";
//const webfft = require("webfft");

const fftsize = 1024;
const fft = new webfft(fftsize);
const profileObj = fft.profile(2); // duration to run profile, in seconds
console.log(profileObj);
console.log("Fastest sub-library:", profileObj.fastestSubLibrary);

// it will automatically set future .fft() calls to use whichever was fastest
