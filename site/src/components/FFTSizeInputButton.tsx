import React, { Dispatch, SetStateAction } from "react";
import Button from "./Button";

interface FFTSizeInputProps {
  fftSize: number;
  setFftSize: Dispatch<SetStateAction<number>>;
}

const FFTSizeInput: React.FC<FFTSizeInputProps> = ({ fftSize, setFftSize }) => {
  const maxFFTSize = 16384; // Setting max limit to a reasonable power of 2
  const minFFTSize = 2; // Setting min limit to a reasonable power of 2

  const incrementFFTSize = () => {
    if (fftSize < maxFFTSize) {
      setFftSize(fftSize * 2);
    }
  };

  const decrementFFTSize = () => {
    if (fftSize > minFFTSize) {
      setFftSize(fftSize / 2);
    }
  };

  return (
    <div>
      <Button className="border rounded-md bg-cyber-background1 border-cyber-primary" onClick={decrementFFTSize}>
        -
      </Button>
      <input
        type="number"
        value={fftSize}
        readOnly
        className="w-24 p-2 border rounded-md bg-cyber-background1 border-cyber-primary text-center"
      />
      <Button className="border rounded-md bg-cyber-background1 border-cyber-primary" onClick={incrementFFTSize}>
        +
      </Button>
    </div>
  );
};

export default FFTSizeInput;
