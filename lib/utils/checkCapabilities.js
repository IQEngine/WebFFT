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
  // Get the user agent string
  let ua = navigator.userAgent;

  let browserName = "Other";
  let browserVersion = "Unknown";

  // Check the browser name and version
  if (/Edg\/\d+\.\d+/.test(ua)) {
    browserName = "Microsoft Edge";
    browserVersion = /Edg\/(\d+\.\d+)/.exec(ua)[1];
  } else if (/Chrome\/\d+\.\d+/.test(ua)) {
    browserName = "Chrome";
    browserVersion = /Chrome\/(\d+\.\d+)/.exec(ua)[1];
  } else if (/Firefox\/\d+\.\d+/.test(ua)) {
    browserName = "Firefox";
    browserVersion = /Firefox\/(\d+\.\d+)/.exec(ua)[1];
  } else if (/Safari\/\d+\.\d+/.test(ua)) {
    browserName = "Safari";
    browserVersion = /Version\/(\d+\.\d+)/.exec(ua)[1];
  }

  let osName = "Other";
  let osVersion = "Unknown";

  // Check if the operating system is Windows
  if (/Windows/.test(ua)) {
    osName = "Windows";
    // Check the Windows version
    if (/Windows NT 10\.0/.test(ua)) {
      osVersion = "10";
    } else if (/Windows NT 6\.3/.test(ua)) {
      osVersion = "8.1";
    } else if (/Windows NT 6\.2/.test(ua)) {
      osVersion = "8";
    } else if (/Windows NT 6\.1/.test(ua)) {
      osVersion = "7";
    } else if (/Windows NT 5\.1/.test(ua)) {
      osVersion = "XP";
    } else if (/Windows NT 5\.0/.test(ua)) {
      osVersion = "2000";
    }
  }

  // Check if the operating system is Mac OS
  else if (/Mac OS X/.test(ua)) {
    osName = "Mac OS X";
    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(ua)[1];
  }

  // Check if the operating system is Linux
  else if (/Linux/.test(ua)) {
    osName = "Linux";
    // Check the architecture
    if (/i686/.test(ua)) {
      osVersion = "32-bit";
    } else if (/x86_64/.test(ua)) {
      osVersion = "64-bit";
    }
  }

  // Check if the operating system is Android
  else if (/Android/.test(ua)) {
    osName = "Android";
    osVersion = /Android ([\.\_\d]+)/.exec(ua)[1];
  }

  // Check if the operating system is iOS
  else if (/iPhone|iPad|iPod/.test(ua)) {
    osName = "iOS";
    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
    osVersion = osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
  }

  return {
    browserName: browserName,
    browserVersion: browserVersion,
    osName: osName,
    osVersion: osVersion,
    wasm: typeof WebAssembly === "object",
    relaxedSimd: await relaxedSimd(),
    simd: await simd(),
  };
}

// Export the function
export default checkBrowserCapabilities;
