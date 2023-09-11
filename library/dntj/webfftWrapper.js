import FFT from "./fft.js"

class DntjWebFftWrapper {
    constructor(size) {
        this.size = size;
        this.outputArr = new Float32Array(2 * size);
    }

    fft(inputArr) {
        this.outputArr = inputArr.FFT();
        return this.outputArr;
    }
}

export default DntjWebFftWrapper;