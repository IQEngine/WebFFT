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
  try {
    if (uad) {
      const values = await uad.getHighEntropyValues([
        "architecture",
        "model",
        "platform",
        "platformVersion",
        "uaFullVersion",
      ]);

      const brandInfo = uad.brands.find((brand) =>
        ["Microsoft Edge", "Google Chrome", "Opera"].includes(brand.brand),
      );
      browserName = brandInfo ? brandInfo.brand : "Other";
      browserVersion = brandInfo ? `v${brandInfo.version}` : "Unknown";
      osName = values.platform ? values.platform : "Other";
      osVersion = values.platformVersion
        ? `v${values.platformVersion}`
        : "Unknown";
    }

    // user agent string parsing for mobile and firefox, safari
    // other browsers included in case mobile
    if (browserName === "Other" || osName === "Other") {
      const uaArr = ua.split(" ");
      const uaBrowser = uaArr[uaArr.length - 1];
      const isFirefox = /Firefox/.test(uaBrowser);
      const isSafari = /Safari/.test(uaBrowser) && !/Chrome/.test(uaBrowser);
      const isChrome = /Chrome/.test(uaBrowser);
      const isEdge = /Edg/.test(uaBrowser);
      const isOpera = /OPR/.test(uaBrowser);

      const browsers = [
        {
          name: "Mozilla Firefox",
          regex: /Firefox\/(\d+\.\d+)/,
          flag: isFirefox,
        },
        { name: "Safari", regex: /Version\/(\d+\.\d+)/, flag: isSafari },
        { name: "Google Chrome", regex: /Chrome\/(\d+\.\d+)/, flag: isChrome },
        { name: "Microsoft Edge", regex: /Edg\/(\d+\.\d+)/, flag: isEdge },
        { name: "Opera", regex: /OPR\/(\d+\.\d+)/, flag: isOpera },
      ];

      for (const browser of browsers) {
        if (browser.flag) {
          browserName = browser.name;
          const versionMatch = uaBrowser.match(browser.regex);
          browserVersion = versionMatch ? versionMatch[1] : "Unknown";
          break;
        }
      }

      const osMatch = ua.match(/\(([^)]+)\)/);
      const osDetails = osMatch ? osMatch[1].split("; ") : [];
      console.log(osMatch);
      console.log(osDetails);

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

      const osInfo = [
        {
          name: "Windows",
          regex: /Windows NT/,
          transform: (s) => windowsVersionMap[s.split(" ")[2]],
          index: 0,
        },
        {
          name: "Mac OS X",
          regex: /Mac OS X/,
          transform: (s) => s.replace("_", ".").split(" ")[3],
          index: 0,
        },
        {
          name: "Linux",
          regex: /Linux/,
          transform: () => "Unknown", // Precise Linux version can be difficult to determine
          index: 0,
        },
        {
          name: "Android",
          regex: /Android/,
          transform: (s) => s.split(" ")[1],
          index: 0,
        },
        {
          name: "iOS",
          regex: /iPhone/,
          transform: (s) => s.split(" ")[1].replace("_", "."),
          index: 0,
        },
      ];

      for (const os of osInfo) {
        if (os.regex.test(osDetails[0])) {
          osName = os.name;
          console.log(`osDetails: ${osDetails}`);
          osVersion = os.transform
            ? os.transform(osDetails[1])
            : os.versionMap[osDetails[1].split(" ")[os.index]];
          break;
        }
      }
    }
  } catch (error) {
    console.error("Could not retrieve user agent data", error);
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
