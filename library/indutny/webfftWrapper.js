import FFT_indutny from "./fft.js"

class IndutnyFftWrapper {
    constructor(size) {
        this.size = size;
        this.indutnyFft = new FFT_indutny(size);
        this.outputArr = new Float32Array(2 * size);
    }

    fft(inputArr) {
        var { indutnyFft, outputArr } = this;
        indutnyFft.transform(outputArr, inputArr);
        return outputArr;
    }
}

export default IndutnyFftWrapper;