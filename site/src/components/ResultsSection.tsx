import React, { useState } from "react";
import HistogramSection from "./HistogramSection";
import TableSection from "./TableSection";

var testResults = {
  names: ['nayuki', 'nayuki2', 'kiss', 'nockert'], 
  values: [2000, 2400, 2200, 1900]
}

function ResultsSection() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Results</h2>

      {/* Embed the HistogramSection here */}
      <HistogramSection results={testResults}/>
      {/* Display table of all of the results here */}
      <TableSection/>
      {/* Assuming you will populate the table with data fetched after the benchmarking */}
    </section>
  );
}

export default ResultsSection;
