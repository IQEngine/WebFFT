import { detect } from "detect-browser";
import { BrowserInfoType } from "../types/types";

export function getBrowserInfo(): BrowserInfoType {
  const browser = detect();

  if (browser && browser.type === "browser") {
    const { name: browserName, version, os } = browser;
    return { browserName, version, os };
  }

  return { browserName: "Unknown", version: "Unknown", os: "Unknown" };
}

export function checkSIMDSupport(): boolean {
  // This is a naive check and might not work in all browsers
  try {
    const simdCheck = WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 127, 1, 127, 3, 130, 128, 128, 128, 0, 1, 0, 4, 132,
        128, 128, 128, 0, 1, 112, 0, 0, 5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 146, 128,
        128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97, 105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1,
        132, 128, 128, 128, 0, 0, 65, 0, 11,
      ])
    );
    return simdCheck;
  } catch (e) {
    console.log(e);
    return false;
  }
}
