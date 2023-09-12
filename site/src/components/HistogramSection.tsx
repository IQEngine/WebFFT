import React, { useState } from "react";
import Plot from 'react-plotly.js';

interface Props {
  results:  {names: string[], values: number[]}
}

function HistogramSection({ results }: Props) {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Histogram</h2>
      {/* Histogram plot here */}
      <Plot
        data={[
          {type: 'bar', x: results.names, y: results.values},
        ]}
        layout={{width: 600, height: 450, title: 'FFT Results'}}
        
      />
    </section>
  );
}

export default HistogramSection;
