// Copyright (C) 2022 Jeppe Johansen - jeppe@j-software.dk
export let wasmBinary = `AGFzbQEAAAABLQlgAX8AYAF9AX1gAX0Bf2ACf38Bf2AAAGACf38CfX1gAn9/AGAAAn9/YAABfwKJ
AQkETWF0aANjb3MAAQRNYXRoA3NpbgABBE1hdGgEY2VpbAACBE1hdGgEbG9nMgABBmNvbmZpZwZw
b2ludHMDfwAGY29uZmlnCWlucHV0VHlwZQN/AAZjb25maWcKb3V0cHV0VHlwZQN/AAZjb25maWcF
c2hpZnQDfwAGY29uZmlnBXNjYWxlA30AAxMSAwAAAAAAAAQFAwQEBAYEBAcIBAQBcAAGBQMBAAEG
PQx/AUEAC38BQQALfwFBAAt/AUEAC38BQQALfwFBAAt/AUEAC38BQQALfwFBAAt/AUEAC38BQQAL
fwFBAAsHNAQGbWVtb3J5AgADcnVuAAsQZ2V0T3V0cHV0QnVmZmVycwAUDmdldElucHV0QnVmZmVy
ABUIARMJDAEAQQALBgoIBQcJBgrwFxJCAQF/IwUgAUEBa2oiAiABQQFrQX9zcSICIABqJAUjBT8A
QYCABGxLBEAjBT8AQYCABGxrQf//A2pBEHZAABoLIAILhAEDBX8BewJ/IwAhASMIIQIjCSEEIwch
A0EAIQUgAUEEbEEBayEHIwMEQCABQQJsIQgFQQAhCAsDQCADIAhqIAL9AAQAIgYgBv3mASAE/QAE
ACIGIAb95gH95AH9CwQAIAhBEGogB3EhCCACQRBqIQIgBEEQaiEEIAVBBGoiBSABSQ0ACwuvAgIG
fwd7IwAhASMLIgMgAWohBCMIIQUjCSEGIwT9EyENA0AgAygCACECIAL9XAIAIQcgAiABQQJsaiAH
/VYCAAEhByACIAFqIAf9VgIAAiEHIAIgAUEDbGogB/1WAgADIQcgByAH/Q0AAQIDAAECAwgJCgsI
CQoLIAcgB/3hAf0NBAUGBxQVFhcMDQ4PHB0eH/3kASEKIAogCv3hAf0NCAkKCxwdHh8YGRobDA0O
DyEMIAz9DAAAAAD/////AAAAAP/////9TiEJIAogCv0NAAECAwQFBgcAAQIDBAUGByAM/Qz/////
AAAAAP////8AAAAA/U795AEhCCAFIAggDf3mAf0LBAAgBiAJIA395gH9CwQAIAVBEGohBSAGQRBq
IQYgA0EEaiIDIARJDQALC58DAgZ/B3sjAEECbCEDIwT9EyELIwshBCMIIQUjCSEGQQAhAQNAIAQo
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`;

export class FFTWasmImpl {
    #memory;
    #run;

    #inputBuffer;
    #realOut;
    #workingBufferR;
    #workingBufferI;

    points = 0;

    /**
     * 
     * @param {Number} points 
     * @param {WebAssembly.WebAssemblyInstantiatedSource} wasmModule
     */
    constructor(points, realOut, wasmModule) {
        if (points < 8) {
          throw new Error("FFT size below 8 is not supported");
        }

        this.points = points;
        this.#realOut = realOut;

        this.#memory = wasmModule.exports.memory;
        this.#run = wasmModule.exports.run;

        let [outpR, outpI] = wasmModule.exports.getOutputBuffers();
        let inp = wasmModule.exports.getInputBuffer();

        this.#inputBuffer = new Float32Array(this.#memory.buffer, inp, points * 2);
        this.#workingBufferR = new Float32Array(this.#memory.buffer, outpR, points);
        this.#workingBufferI = new Float32Array(this.#memory.buffer, outpI, points);
    }

    /**
     * Get the input buffer. The formatting of data depends on what settings the FFT was initialized with. Real input will be an array
     * of `points` Float32's. Complex input will be an `Float32Array` with `points` `Float32` I/Q pairs interleaved.
     * @returns {Float32Array} Input buffer
     */
    getInputBuffer() {
        return this.#inputBuffer
    }

    /**
     * Get output buffer(s)
     * @returns {Array<Float32Array> | Float32Array} Separate I/Q arrays, or single magnitude square array
     */
    getOutputBuffer() {
        if (this.#realOut)
            return this.#workingBufferR;
        else
            return [this.#workingBufferR, this.#workingBufferI];
    }

    /**
     * Run a single FFT transform.
     */
    run() {
        this.#run();
    }
}

/**
 * 
 * @param {Number} points Number of points in FFT
 * @param {String} inputType Type of inputs. Can be "real" or "complex".
 * @param {String} outputType Type of output. Can be "magsqr" or "complex". "magsqr" returns an array of Float32 containing |Fi]^2
 * @param {String} wasmPath Path to .wasm file
 * @param {Boolean} shift Whether to shift so omega(0) is at index points/2
 * @param {Number} scale Scale input by this value
 * @returns {Promise<FFTWasmImpl>}
 */
async function getFFTAsync(points, inputType = "complex", outputType = "complex", wasmPath = "/fft.wasm", shift = false, scale = 1.0) {
    const importObject = {
        Math: Math,
        config: {
            points: points,
            inputType:  {"complex": 0, "real": 1}[inputType],
            outputType: {"magsqr": 0, "complex": 1}[outputType],
            shift: shift ? 1 : 0,
            scale: scale
        }
    };

    return await fetch(wasmPath).then(async resp => {
        return await WebAssembly.instantiate(await resp.arrayBuffer(), importObject).then((obj) => {
            return new FFTWasmImpl(points, outputType != "complex", obj);
        });
    });
}

/**
 * 
 * @param {WebAssembly.Module} module Compiled module
 * @param {Number} points Number of points in FFT
 * @param {String} inputType Type of inputs. Can be "real" or "complex".
 * @param {String} outputType Type of output. Can be "magsqr" or "complex". "magsqr" returns an array of Float32 containing |Fi]^2
 * @param {Boolean} shift Whether to shift so omega(0) is at index points/2
 * @param {Number} scale Scale input by this value
 * @returns {FFTWasmImpl}
 */
export function getFFT(module, points, inputType = "complex", outputType = "complex", shift = false, scale = 1.0) {
    const importObject = {
        Math: Math,
        config: {
            points: points,
            inputType:  {"complex": 0, "real": 1}[inputType],
            outputType: {"magsqr": 0, "complex": 1}[outputType],
            shift: shift ? 1 : 0,
            scale: scale
        }
    };

    var instance = new WebAssembly.Instance(module, importObject);
    return new FFTWasmImpl(points, outputType != "complex", instance);
}
