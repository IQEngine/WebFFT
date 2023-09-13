export default class webfft {
  constructor(size: number, subLibrary?: string, useProfile?: boolean);
  setSubLibrary(subLibrary: string): void;
  fft(inputArr: Float32Array): Float32Array;
  availableSubLibraries(): string[];
  profile(duration?: number): ProfileResult;
}

export interface ProfileResult {
  ffsPerSecond: number[];
  subLibraries: string[];
  totalElapsed: number;
  fastestSubLibrary: string;
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
