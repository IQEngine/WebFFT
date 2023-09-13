import FFT_vail from "./fft.js";

class VailFftWrapperJavascript {
  constructor(size) {
    // Vail doesnt have any constructor on its own, it figures out the size based on input
  }

  fft(inputArr) {
    this.outputArr = new Float32Array(inputArr.length);
    /*
    const input_real = new Float32Array(inputArr.length);
    const input_imag = new Float32Array(inputArr.length);
    for (let i = 0; i < inputArr.length; i++) {
      input_real[i] = inputArr[2 * i];
      input_imag[i] = inputArr[2 * i + 1];
    }
    const vail_in = [[input_real, input_imag]];
    const outputArr = FFT_vail.fft(vail_in);
    */
    const outputArr = FFT_vail.fft(inputArr);
    //console.log(outputArr);
    return outputArr;
  }
}

export default VailFftWrapperJavascript;
