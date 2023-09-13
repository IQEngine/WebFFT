// The following SIMD checkers were taken from 'wasm-feature-detect' NPM package:
async function relaxedSimd() {
  return await WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 15, 1, 13, 0, 65, 1, 253, 15, 65, 2, 253, 15,
      253, 128, 2, 11,
    ])
  );
}

async function simd() {
  return await WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
    ])
  );
}

// Define the async function to check for Wasm and SIMD support
async function checkBrowserCapabilities() {
  return {
    wasm: typeof WebAssembly === "object",
    relaxedSimd: await relaxedSimd(),
    simd: await simd(),
  };
}

// Export the function
export default checkBrowserCapabilities;
