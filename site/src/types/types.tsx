type HistogramData = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
};

type MockDataType = {
  FFTSize: number;
  duration: number;
  browserInfo: BrowserInfoType;
  simdSupport: boolean;
  testResult: number;
};

export type BrowserInfoType = {
  browserName: string;
  version: string | null;
  os: string | null;
};

export type MockTestResultsType = {
  results: MockDataType[];
};
