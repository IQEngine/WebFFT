"use strict";

/* Modification Notes
- Removing the inv part increased it by 3% or so

*/

function FFT_indutny(size) {
  this.size = size | 0;
  if (this.size <= 1 || (this.size & (this.size - 1)) !== 0)
    throw new Error("FFT size must be a power of two and bigger than 1");

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

  // Calculate initial step's width:
  //   * If we are full radix-4 - it is 2x smaller to give inital len=8
  //   * Otherwise it is the same as `power` to give len=4
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

  this._out = null;
  this._data = null;
  this._out = new Float32Array(2 * size);
}

// radix-4 implementation
FFT_indutny.prototype.transform = function transform(data) {
  this._data = data;
  var size = this._csize;

  // Initial step (permute and transform)
  var step = 1 << this._width;
  var len = (size / step) << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  // len is either 4 or 8, and we need to keep both
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

// radix-2 implementation NOTE: Only called for len=4
FFT_indutny.prototype._singleTransform2 = function _singleTransform2(
  outOff,
  off,
  step,
) {
  const out = this._out;
  const data = this._data;

  const evenR = data[off];
  const evenI = data[off + 1];
  const oddR = data[off + step];
  const oddI = data[off + step + 1];

  const leftR = evenR + oddR;
  const leftI = evenI + oddI;
  const rightR = evenR - oddR;
  const rightI = evenI - oddI;

  out[outOff] = leftR;
  out[outOff + 1] = leftI;
  out[outOff + 2] = rightR;
  out[outOff + 3] = rightI;
};

// radix-4 NOTE: Only called for len=8
FFT_indutny.prototype._singleTransform4 = function _singleTransform4(
  outOff,
  off,
  step,
) {
  const step2 = step * 2;
  const step3 = step * 3;

  // Original values
  const Ar = this._data[off];
  const Ai = this._data[off + 1];
  const Br = this._data[off + step];
  const Bi = this._data[off + step + 1];
  const Cr = this._data[off + step2];
  const Ci = this._data[off + step2 + 1];
  const Dr = this._data[off + step3];
  const Di = this._data[off + step3 + 1];

  // Pre-Final values
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

export default FFT_indutny;
