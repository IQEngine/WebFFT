export type BrowserInfoType = {
  browserName: string;
  version: string | null;
  os: string | null;
};

export type FFTCalculationData = {
  type: "FFT_CALCULATION";
  amplitude: number;
  frequency: number;
};

export type ProfileData = {
  type: "PROFILE";
  fftSize: number;
  duration: number;
};

export type MessageData = FFTCalculationData | ProfileData;
