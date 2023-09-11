import * as math from "mathjs";

export class FFT {
  data: math.Complex[];

  constructor(data: math.Complex[]) {
    this.data = data;
  }

  computeFFT(): math.Complex[] {
    return this.data.map((c) => math.complex(c.re, c.im));
  }

  powerSpectralDensity(): number[] {
    const fftValues = math.fft(this.computeFFT());
    return fftValues.map(
      (val: math.Complex) => 10 * math.log10(val.re ** 2 + val.im ** 2)
    );
  }
}
