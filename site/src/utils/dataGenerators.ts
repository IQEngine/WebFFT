import { complex, Complex } from "mathjs";
import { FFT } from "../models/FFT";

export const generateRandomComplexNumbers = (count: number): Complex[] => {
  const complexNumbers: Complex[] = [];

  for (let i = 0; i < count; i++) {
    const realPart = Math.random();
    const imaginaryPart = Math.random();
    complexNumbers.push(complex(realPart, imaginaryPart));
  }

  return complexNumbers;
};

export const computeSpectralDensity = (data: Complex[]): number[] => {
  const fftInstance = new FFT(data);
  return fftInstance.powerSpectralDensity();
};
