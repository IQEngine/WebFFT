import { fft } from "kissfft-wasm";

const size = 1024;

// Create input array
const ci = new Float32Array(2 * size);
for (let j = 0; j < size; j++) {
  ci[2 * j] = Math.random() - 0.5;
  ci[2 * j + 1] = Math.random() - 0.5;
}

const co = fft(ci);

console.log(co);
