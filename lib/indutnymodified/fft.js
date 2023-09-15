"use strict";

/* Modification Notes
- Removing the inv part increased it by 3% or so
- Simplifying transform hurt because i was repeating the same math
- getting rid of the wrapper imrpoved it by like 1%
*/

function IndutnyModifiedFftWrapperJavascript(size) {
  this.size = size;

  this._csize = size << 1;

  var table = new Array(this.size * 2);
  for (var i = 0; i < table.length; i += 2) {
    const angle = (Math.PI * i) / this.size;
    table[i] = Math.cos(angle);
    table[i + 1] = -Math.sin(angle);
  }
  this.table = table;

  // Find size's power of two
  var power = 0;
  for (var t = 1; this.size > t; t <<= 1) power++;

  // Calculate initial step's width, either 4 or 8 depending on the fftsize
  this._width = power % 2 === 0 ? power - 1 : power;

  // Pre-compute bit-reversal patterns
  this._bitrev = new Array(1 << this._width);
  for (var j = 0; j < this._bitrev.length; j++) {
    this._bitrev[j] = 0;
    for (var shift = 0; shift < this._width; shift += 2) {
      var revShift = this._width - shift - 2;
      this._bitrev[j] |= ((j >>> shift) & 3) << revShift;
    }
  }

  this._data = null;
  this._out = new Float32Array(2 * size);
}

// FFT
IndutnyModifiedFftWrapperJavascript.prototype.fft = function fft(data) {
  this._data = data;
  var size = this._csize;

  // Initial step (permute and transform)
  var step = 1 << this._width;
  var len = (size / step) << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  // len is either 4 or 8, and both are used for the common fft sizes
  if (len === 4) {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleTransform2(outOff, off, step);
    }
  } else {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleTransform4(outOff, off, step);
    }
  }

  // Loop through steps in decreasing order
  for (step >>= 2; step >= 2; step >>= 2) {
    len = (size / step) << 1;
    var quarterLen = len >>> 2;

    // Loop through offsets in the data
    for (outOff = 0; outOff < size; outOff += len) {
      // Full case
      var limit = outOff + quarterLen;
      for (var i = outOff, k = 0; i < limit; i += 2, k += step) {
        const A = i;
        const B = A + quarterLen;
        const C = B + quarterLen;
        const D = C + quarterLen;

        // Original values
        const Ar = this._out[A];
        const Ai = this._out[A + 1];
        const Br = this._out[B];
        const Bi = this._out[B + 1];
        const Cr = this._out[C];
        const Ci = this._out[C + 1];
        const Dr = this._out[D];
        const Di = this._out[D + 1];

        // Middle values
        const MAr = Ar;
        const MAi = Ai;

        const tableBr = this.table[k];
        const tableBi = this.table[k + 1];
        const MBr = Br * tableBr - Bi * tableBi;
        const MBi = Br * tableBi + Bi * tableBr;

        const tableCr = this.table[2 * k];
        const tableCi = this.table[2 * k + 1];
        const MCr = Cr * tableCr - Ci * tableCi;
        const MCi = Cr * tableCi + Ci * tableCr;

        const tableDr = this.table[3 * k];
        const tableDi = this.table[3 * k + 1];
        const MDr = Dr * tableDr - Di * tableDi;
        const MDi = Dr * tableDi + Di * tableDr;

        // Pre-Final values
        const T0r = MAr + MCr;
        const T0i = MAi + MCi;
        const T1r = MAr - MCr;
        const T1i = MAi - MCi;
        const T2r = MBr + MDr;
        const T2i = MBi + MDi;
        const T3r = MBr - MDr;
        const T3i = MBi - MDi;

        this._out[A] = T0r + T2r;
        this._out[A + 1] = T0i + T2i;
        this._out[B] = T1r + T3i;
        this._out[B + 1] = T1i - T3r;
        this._out[C] = T0r - T2r;
        this._out[C + 1] = T0i - T2i;
        this._out[D] = T1r - T3i;
        this._out[D + 1] = T1i + T3r;
      }
    }
  }

  return this._out;
};

// radix-2 (called for len=4)
IndutnyModifiedFftWrapperJavascript.prototype._singleTransform2 =
  function _singleTransform2(outOff, off, step) {
    const evenR = this._data[off];
    const evenI = this._data[off + 1];
    const oddR = this._data[off + step];
    const oddI = this._data[off + step + 1];

    this._out[outOff] = evenR + oddR;
    this._out[outOff + 1] = evenI + oddI;
    this._out[outOff + 2] = evenR - oddR;
    this._out[outOff + 3] = evenI - oddI;
  };

// radix-4 (called for len=8)
IndutnyModifiedFftWrapperJavascript.prototype._singleTransform4 =
  function _singleTransform4(outOff, off, step) {
    const step2 = step * 2;
    const step3 = step * 3;

    const Ar = this._data[off];
    const Ai = this._data[off + 1];
    const Br = this._data[off + step];
    const Bi = this._data[off + step + 1];
    const Cr = this._data[off + step2];
    const Ci = this._data[off + step2 + 1];
    const Dr = this._data[off + step3];
    const Di = this._data[off + step3 + 1];

    const T0r = Ar + Cr;
    const T0i = Ai + Ci;
    const T1r = Ar - Cr;
    const T1i = Ai - Ci;
    const T2r = Br + Dr;
    const T2i = Bi + Di;
    const T3r = Br - Dr;
    const T3i = Bi - Di;

    this._out[outOff] = T0r + T2r;
    this._out[outOff + 1] = T0i + T2i;
    this._out[outOff + 2] = T1r + T3i;
    this._out[outOff + 3] = T1i - T3r;
    this._out[outOff + 4] = T0r - T2r;
    this._out[outOff + 5] = T0i - T2i;
    this._out[outOff + 6] = T1r - T3i;
    this._out[outOff + 7] = T1i + T3r;
  };

export default IndutnyModifiedFftWrapperJavascript;
