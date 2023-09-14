export default class webfft {
  constructor(size: number, subLibrary?: string, useProfile?: boolean);
  setSubLibrary(subLibrary: string): void;
  fft(inputArr: Float32Array): Float32Array;
  availableSubLibraries(): string[];
  profile(duration?: number): ProfileResult;
  checkBrowserCapabilities(): BrowserCapabilities;
}

export interface ProfileResult {
  fftsPerSecond: number[];
  subLibraries: string[];
  totalElapsed: number;
  fastestSubLibrary: string;
}

export interface BrowserCapabilities {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  wasm: boolean;
  relaxedSimd: boolean;
  simd: boolean;
}

export interface WebfftWrapper {
  fft(inputArr: Float32Array): Float32Array;
}

export interface KissFftWrapperWasm extends WebfftWrapper {}
export interface IndutnyFftWrapperJavascript extends WebfftWrapper {}
export interface DntjWebFftWrapperJavascript extends WebfftWrapper {}
export interface CrossFftWrapperWasm extends WebfftWrapper {}
export interface NayukiFftWrapperJavascript extends WebfftWrapper {}
export interface NayukiWasmFftWrapperWasm extends WebfftWrapper {}
export interface NockertFftWrapperJavascript extends WebfftWrapper {}
