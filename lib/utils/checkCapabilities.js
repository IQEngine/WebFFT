// The following SIMD checkers were taken from 'wasm-feature-detect' NPM package:
async function relaxedSimd() {
  return await WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 15,
      1, 13, 0, 65, 1, 253, 15, 65, 2, 253, 15, 253, 128, 2, 11,
    ]),
  );
}

async function simd() {
  return await WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
      1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
    ]),
  );
}

// Define the async function to check for Wasm and SIMD support
async function checkBrowserCapabilities() {
  let browserName = "Other";
  let browserVersion = "Unknown";
  let osName = "Other";
  let osVersion = "Unknown";
  let uad = navigator.userAgentData;
  let ua = navigator.userAgent;

  // Check if Edge, Chrome, or Opera (uses User Agent Data API)
  if (uad) {
    try {
      const values = await uad.getHighEntropyValues([
        "architecture",
        "model",
        "platform",
        "platformVersion",
        "uaFullVersion",
      ]);

      const brandInfo = values.brands.find((brand) =>
        ["Microsoft Edge", "Chromium", "Google Chrome", "Opera"].includes(
          brand.brand,
        ),
      );
      browserName = brandInfo ? brandInfo.brand : "Other";
      browserVersion = brandInfo ? brandInfo.version : "Unknown";
      osName = values.platform;
      osVersion = values.platformVersion;
    } catch (error) {
      console.error("Could not retrieve user agent data", error);
    }
  }
  // Check if Mozilla
  else if (/Firefox|Safari/.test(ua)) {
    const isFirefox = /Firefox/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);

    if (isFirefox) {
      browserName = "Mozilla Firefox";
      const firefoxVersionMatch = ua.match(/Firefox\/(\d+\.\d+)/);
      browserVersion = firefoxVersionMatch ? firefoxVersionMatch[1] : "Unknown";
    } else if (isSafari) {
      browserName = "Safari";
      const safariVersionMatch = ua.match(/Version\/(\d+\.\d+)/);
      browserVersion = safariVersionMatch ? safariVersionMatch[1] : "Unknown";
    }

    const osMatch = ua.match(/\(([^)]+)\)/);
    const osDetails = osMatch ? osMatch[1].split("; ") : [];

    if (osDetails[0].includes("Windows NT")) {
      osName = "Windows";
      const windowsVersionMap = {
        "10.0": "10",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7",
        "6.0": "Vista",
        "5.2": "XP 64-bit",
        "5.1": "XP",
        "5.0": "2000",
      };
      osVersion = windowsVersionMap[osDetails[0].split(" ")[2]];
    } else if (osDetails[0].includes("Mac OS X")) {
      osName = "Mac OS X";
      osVersion = osDetails[0].replace("_", ".").split(" ")[3];
    } else if (osDetails[0].includes("Linux")) {
      osName = "Linux";
      osVersion = "Unknown"; // Precise Linux version can be difficult to determine
    } else if (osDetails[0].includes("Android")) {
      osName = "Android";
      osVersion = osDetails[0].split(" ")[1];
    } else if (osDetails[0].includes("iPhone")) {
      osName = "iOS";
      osVersion = osDetails[0].split(" ")[1].replace("_", ".");
    }
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
