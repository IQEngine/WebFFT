// core operations
let _n = 0; // order
let _bitrev = null; // bit reversal table
let _cstb = null; // sin/cos table

function init(n) {
  if (n !== 0 && (n & (n - 1)) === 0) {
    _n = n;
    _initArray();
    _makeBitReversalTable();
    _makeCosSinTable();
  } else {
    throw new Error("init: radix-2 required");
  }
}

// 1D-FFT
function fft1d(re, im) {
  fastFourierTransform(re, im, 1);
}

// 1D-IFFT
function ifft1d(re, im) {
  let n = 1 / _n;
  fastFourierTransform(re, im, -1);
  for (let i = 0; i < _n; i++) {
    re[i] *= n;
    im[i] *= n;
  }
}

// 1D-IFFT
function bt1d(re, im) {
  fastFourierTransform(re, im, -1);
}

// 2D-FFT Not very useful if the number of rows have to be equal to cols
function fft2d(re, im) {
  let tre = [];
  let tim = [];
  let i = 0;
  // x-axis
  for (let y = 0; y < _n; y++) {
    i = y * _n;
    for (let x1 = 0; x1 < _n; x1++) {
      tre[x1] = re[x1 + i];
      tim[x1] = im[x1 + i];
    }
    fft1d(tre, tim);
    for (let x2 = 0; x2 < _n; x2++) {
      re[x2 + i] = tre[x2];
      im[x2 + i] = tim[x2];
    }
  }
  // y-axis
  for (let x = 0; x < _n; x++) {
    for (let y1 = 0; y1 < _n; y1++) {
      i = x + y1 * _n;
      tre[y1] = re[i];
      tim[y1] = im[i];
    }
    fft1d(tre, tim);
    for (let y2 = 0; y2 < _n; y2++) {
      i = x + y2 * _n;
      re[i] = tre[y2];
      im[i] = tim[y2];
    }
  }
}

// 2D-IFFT
function ifft2d(re, im) {
  let tre = [];
  let tim = [];
  let i = 0;
  // x-axis
  for (let y = 0; y < _n; y++) {
    i = y * _n;
    for (let x1 = 0; x1 < _n; x1++) {
      tre[x1] = re[x1 + i];
      tim[x1] = im[x1 + i];
    }
    ifft1d(tre, tim);
    for (let x2 = 0; x2 < _n; x2++) {
      re[x2 + i] = tre[x2];
      im[x2 + i] = tim[x2];
    }
  }
  // y-axis
  for (let x = 0; x < _n; x++) {
    for (let y1 = 0; y1 < _n; y1++) {
      i = x + y1 * _n;
      tre[y1] = re[i];
      tim[y1] = im[i];
    }
    ifft1d(tre, tim);
    for (let y2 = 0; y2 < _n; y2++) {
      i = x + y2 * _n;
      re[i] = tre[y2];
      im[i] = tim[y2];
    }
  }
}

// core operation of FFT
function fastFourierTransform(re, im, inv) {
  let d;
  let h;
  let ik;
  let m;
  let tmp;
  let wr;
  let wi;
  let xr;
  let xi;
  let n4 = _n >> 2;
  // bit reversal
  for (let l = 0; l < _n; l++) {
    m = _bitrev[l];
    if (l < m) {
      tmp = re[l];
      re[l] = re[m];
      re[m] = tmp;
      tmp = im[l];
      im[l] = im[m];
      im[m] = tmp;
    }
  }
  // butterfly operation
  for (let k = 1; k < _n; k <<= 1) {
    h = 0;
    d = _n / (k << 1);
    for (let j = 0; j < k; j++) {
      wr = _cstb[h + n4];
      wi = inv * _cstb[h];
      for (let i = j; i < _n; i += k << 1) {
        ik = i + k;
        xr = wr * re[ik] + wi * im[ik];
        xi = wr * im[ik] - wi * re[ik];
        re[ik] = re[i] - xr;
        re[i] += xr;
        im[ik] = im[i] - xi;
        im[i] += xi;
      }
      h += d;
    }
  }
}

// initialize the array (supports TypedArray)
function _initArray() {
  if (typeof Uint32Array !== "undefined") {
    _bitrev = new Uint32Array(_n);
  } else {
    _bitrev = [];
  }
  if (typeof Float64Array !== "undefined") {
    _cstb = new Float64Array(_n * 1.25);
  } else {
    _cstb = [];
  }
}

//function _paddingZero() {
//    // TODO
//}

function _makeBitReversalTable() {
  let i = 0;
  let j = 0;
  let k = 0;
  _bitrev[0] = 0;
  while (++i < _n) {
    k = _n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
    _bitrev[i] = j;
  }
}

// makes trigonometric function table
function _makeCosSinTable() {
  let n2 = _n >> 1;
  let n4 = _n >> 2;
  let n8 = _n >> 3;
  let n2p4 = n2 + n4;
  let t = Math.sin(Math.PI / _n);
  let dc = 2 * t * t;
  let ds = Math.sqrt(dc * (2 - dc));
  let c = (_cstb[n4] = 1);
  let s = (_cstb[0] = 0);
  t = 2 * dc;
  for (let i = 1; i < n8; i++) {
    c -= dc;
    dc += t * c;
    s += ds;
    ds -= t * s;
    _cstb[i] = s;
    _cstb[n4 - i] = c;
  }
  if (n8 !== 0) {
    _cstb[n8] = Math.sqrt(0.5);
  }
  for (let j = 0; j < n4; j++) {
    _cstb[n2 - j] = _cstb[j];
  }
  for (let k = 0; k < n2p4; k++) {
    _cstb[k + n2] = -_cstb[k];
  }
}

const FFT = {
  init,
  fft1d,
  ifft1d,
  fft2d,
  ifft2d,
  fft: fft1d,
  ifft: ifft1d,
  bt: bt1d
};

export default FFT;
