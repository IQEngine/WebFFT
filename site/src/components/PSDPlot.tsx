import React, { memo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { computeSpectralDensity } from "../utils/dataGenerators";
import { FFTProps } from "../types/componentTypes";

const PSDPlot: React.FC<FFTProps> = memo(({ data }) => {
  // Assuming computeSpectralDensity() processes data for one dataset at a time.
  // If you want to process all datasets together, you will need further changes.

  const plotData = data.map((dataPoint) => {
    const powerSpectralDensity = computeSpectralDensity(dataPoint.data);
    const len = powerSpectralDensity.length;
    const f = Array.from({ length: len }, (_, i) => -0.5 + i / len);

    return {
      id: dataPoint.id,
      data: f.map((value, index) => ({
        x: value,
        y: powerSpectralDensity[index]
      }))
    };
  });

  return (
    <div className="plot-centered">
      <ResponsiveLine
        data={plotData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "linear", min: -0.5, max: 0.5 }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 10,
          legend: "Frequency [Hz Normalized]",
          legendPosition: "middle",
          legendOffset: 40
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 5,
          legend: "PSD [dB]",
          legendPosition: "middle",
          legendOffset: -40
        }}
        pointSize={0}
      />
    </div>
  );
});

export default PSDPlot;
