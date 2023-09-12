var KissFFTModule = (function () {
  var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : undefined;

  return function (KissFFTModule) {
    KissFFTModule = KissFFTModule || {};

    var Module = typeof KissFFTModule !== "undefined" ? KissFFTModule : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    Module["locateFile"] = (path, scriptDirectory_unused) => {
      return path;
    };
    var moduleOverrides = {};
    var key;
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = function (status, toThrow) {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = false;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document !== "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      {
        read_ = function (url) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          } catch (err) {
            var data = tryParseAsDataURI(url);
            if (data) {
              return intArrayToString(data);
            }
            throw err;
          }
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = function (url) {
            try {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            } catch (err) {
              var data = tryParseAsDataURI(url);
              if (data) {
                return data;
              }
              throw err;
            }
          };
        }
        readAsync = function (url, onload, onerror) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = function () {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response);
              return;
            }
            var data = tryParseAsDataURI(url);
            if (data) {
              onload(data.buffer);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = function (title) {
        document.title = title;
      };
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }
    function getCFunc(ident) {
      var func = Module["_" + ident];
      assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
      return func;
    }
    function ccall(ident, returnType, argTypes, args, opts) {
      var toC = {
        string: function (str) {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) {
            var len = (str.length << 2) + 1;
            ret = stackAlloc(len);
            stringToUTF8(str, ret, len);
          }
          return ret;
        },
        array: function (arr) {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
      function convertReturnValue(ret) {
        if (returnType === "string") return UTF8ToString(ret);
        if (returnType === "boolean") return Boolean(ret);
        return ret;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      ret = convertReturnValue(ret);
      if (stack !== 0) stackRestore(stack);
      return ret;
    }
    function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      var numericArgs = argTypes.every(function (type) {
        return type === "number";
      });
      var numericRet = returnType !== "string";
      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }
      return function () {
        return ccall(ident, returnType, argTypes, arguments, opts);
      };
    }
    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = heap[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heap[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = heap[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function writeArrayToMemory(array, buffer) {
      HEAP8.set(array, buffer);
    }
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }
      what += "";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    var wasmBinaryFile;
    wasmBinaryFile =
      "data:application/octet-stream;base64,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AiAFDQELCyAGQaABaiAHQQN0aiAAOQMAIARBAWshAiAEQQBKDQALC0QAAAAAAAAAACEAIANBAE4EQCADIQIDQCAAIAZBoAFqIAJBA3RqKwMAoCEAIAJBAEohBCACQQFrIQIgBA0ACwsgCCAAmiAAIAsbOQMAIAYrA6ABIAChIQBBASECIANBAU4EQANAIAAgBkGgAWogAkEDdGorAwCgIQAgAiADRyEEIAJBAWohAiAEDQALCyAIIACaIAAgCxs5AwggBkGwBGokACAJQQdxIQMgCCsDACEAIBlCf1cEQCABIACaOQMAIAEgCCsDCJo5AwhBACADayEDDAELIAEgADkDACABIAgrAwg5AwgLIAhBMGokACADC6QEAQN/IAEgAkYEQCAAKAIAQQN0EAUiBCABQQFBASAAQQhqIAAQCCAEIQICQCAAKAIAQQN0IgNBgARPBEAgASACIAMQABoMAQsgASADaiEAAkAgASACc0EDcUUEQAJAIAFBA3FFDQAgA0EBSA0AA0AgASACLQAAOgAAIAJBAWohAiABQQFqIgFBA3FFDQEgACABSw0ACwsCQCAAQXxxIgNBwABJDQAgASADQUBqIgVLDQADQCABIAIoAgA2AgAgASACKAIENgIEIAEgAigCCDYCCCABIAIoAgw2AgwgASACKAIQNgIQIAEgAigCFDYCFCABIAIoAhg2AhggASACKAIcNgIcIAEgAigCIDYCICABIAIoAiQ2AiQgASACKAIoNgIoIAEgAigCLDYCLCABIAIoAjA2AjAgASACKAI0NgI0IAEgAigCODYCOCABIAIoAjw2AjwgAkFAayECIAFBQGsiASAFTQ0ACwsgASADTw0BA0AgASACKAIANgIAIAJBBGohAiABQQRqIgEgA0kNAAsMAQsgAEEESQ0AIAEgAEEEayIDSw0AA0AgASACLQAAOgAAIAEgAi0AAToAASABIAItAAI6AAIgASACLQADOgADIAJBBGohAiABQQRqIgEgA00NAAsLIAAgAUsEQANAIAEgAi0AADoAACACQQFqIQIgAUEBaiIBIABHDQALCwsgBBAHDwsgAiABQQFBASAAQQhqIAAQCAuaBQIDfwN8IABBA3RBiAJqIQQCQCADRQRAIAQQBSECDAELIAIEf0EAIAIgAygCACAESRsFQQALIQIgAyAENgIACyACBEAg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";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        var binary = tryParseAsDataURI(file);
        if (binary) {
          return binary;
        }
        if (readBinary) {
          return readBinary(file);
        } else {
          throw "sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";
        }
      } catch (err) {
        abort(err);
      }
    }
    function instantiateSync(file, info) {
      var instance;
      var module;
      var binary;
      try {
        binary = getBinary(file);
        module = new WebAssembly.Module(binary);
        instance = new WebAssembly.Instance(module, info);
      } catch (e) {
        var str = e.toString();
        err("failed to compile wasm module: " + str);
        if (str.includes("imported Memory") || str.includes("memory import")) {
          err(
            "Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time)."
          );
        }
        throw e;
      }
      return [instance, module];
    }
    function createWasm() {
      var info = { a: asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["c"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["m"];
        addOnInit(Module["asm"]["d"]);
        removeRunDependency("wasm-instantiate");
      }
      addRunDependency("wasm-instantiate");
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      var result = instantiateSync(wasmBinaryFile, info);
      receiveInstance(result[0]);
      return Module["asm"];
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback(Module);
          continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
          if (callback.arg === undefined) {
            wasmTable.get(func)();
          } else {
            wasmTable.get(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }
    function abortOnCannotGrowMemory(requestedSize) {
      abort("OOM");
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      abortOnCannotGrowMemory(requestedSize);
    }
    var ASSERTIONS = false;
    function intArrayToString(array) {
      var ret = [];
      for (var i = 0; i < array.length; i++) {
        var chr = array[i];
        if (chr > 255) {
          if (ASSERTIONS) {
            assert(
              false,
              "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF."
            );
          }
          chr &= 255;
        }
        ret.push(String.fromCharCode(chr));
      }
      return ret.join("");
    }
    var decodeBase64 =
      typeof atob === "function"
        ? atob
        : function (input) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
              enc1 = keyStr.indexOf(input.charAt(i++));
              enc2 = keyStr.indexOf(input.charAt(i++));
              enc3 = keyStr.indexOf(input.charAt(i++));
              enc4 = keyStr.indexOf(input.charAt(i++));
              chr1 = (enc1 << 2) | (enc2 >> 4);
              chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
              chr3 = ((enc3 & 3) << 6) | enc4;
              output = output + String.fromCharCode(chr1);
              if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
              }
              if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
              }
            } while (i < input.length);
            return output;
          };
    function intArrayFromBase64(s) {
      try {
        var decoded = decodeBase64(s);
        var bytes = new Uint8Array(decoded.length);
        for (var i = 0; i < decoded.length; ++i) {
          bytes[i] = decoded.charCodeAt(i);
        }
        return bytes;
      } catch (_) {
        throw new Error("Converting base64 string to bytes failed.");
      }
    }
    function tryParseAsDataURI(filename) {
      if (!isDataURI(filename)) {
        return;
      }
      return intArrayFromBase64(filename.slice(dataURIPrefix.length));
    }
    var asmLibraryArg = { a: _emscripten_memcpy_big, b: _emscripten_resize_heap };
    var asm = createWasm();
    var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = asm["d"]);
    var _kiss_fft_free = (Module["_kiss_fft_free"] = asm["e"]);
    var _free = (Module["_free"] = asm["f"]);
    var _kiss_fft_alloc = (Module["_kiss_fft_alloc"] = asm["g"]);
    var _malloc = (Module["_malloc"] = asm["h"]);
    var _kiss_fft = (Module["_kiss_fft"] = asm["i"]);
    var stackSave = (Module["stackSave"] = asm["j"]);
    var stackRestore = (Module["stackRestore"] = asm["k"]);
    var stackAlloc = (Module["stackAlloc"] = asm["l"]);
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      args = args || arguments_;
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run;
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();

    return KissFFTModule;
  };
})();
if (typeof exports === "object" && typeof module === "object") module.exports = KissFFTModule;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return KissFFTModule;
  });
else if (typeof exports === "object") exports["KissFFTModule"] = KissFFTModule;
