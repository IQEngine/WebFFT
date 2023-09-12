import React, { memo } from "react";
import "../styles/Plots.css";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { FFTProps } from "../types/componentTypes";

const FFTScatterPlot: React.FC<FFTProps> = memo(({ data }) => {
  // Convert the complex data to scatter plot data format
  const scatterData = data.map((dp) => {
    return {
      id: dp.id,
      data: dp.data.map((complexValue) => {
        return {
          x: complexValue.re, // real part for x-axis
          y: complexValue.im // imaginary part for y-axis
        };
      })
    };
  });

  // Compute the minimum and maximum values for X and Y axes
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  scatterData.forEach((dp) => {
    dp.data.forEach((d) => {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.y > maxY) maxY = d.y;
    });
  });

  return (
    <div className="plot-centered">
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 40, right: 40, bottom: 70, left: 90 }}
        xScale={{ type: "linear", min: minX, max: maxX }}
        yScale={{ type: "linear", min: minY, max: maxY }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 10,
          legend: "I",
          legendPosition: "middle",
          legendOffset: 40
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 10,
          legend: "Q",
          legendPosition: "middle",
          legendOffset: -60
        }}
        useMesh={true}
      />
    </div>
  );
});

export default FFTScatterPlot;
