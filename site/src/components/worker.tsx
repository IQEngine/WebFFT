import webfft, { ProfileResult } from "webfft";

// export const loopworker = () => {

// self.addEventListener("message", ({ data }) => {
//   let { type, payload } = data;
//   var { fftSize, duration } = payload;
//   console.log(data);
//   if (type === "UPDATE") {
//     var fft = new webfft(fftSize);
//     const profileObj: ProfileResult = fft.profile(duration); // arg is duration to run profile, in seconds
//     self.postMessage({ type: "UPDATE_SUCCESS", payload: profileObj });
//   }
// });

onmessage = function (event) {
  console.log("hereeeeee");
  let data = event.data;
  var { fftSize, duration } = data.payload;
  console.log(data);
  var fft = new webfft(fftSize);
  const profileObj: ProfileResult = fft.profile(duration); // arg is duration to run profile, in seconds
  self.postMessage(profileObj);
  postMessage(profileObj);
};
// };

// let code = loopworker.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
// const blob = new Blob([code], { type: "application/javascriptssky" });
// export const workerScript = URL.createObjectURL(blob);
