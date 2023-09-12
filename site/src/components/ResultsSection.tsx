import React, { useState } from "react";
import HistogramSection from "./HistogramSection";

function ResultsSection() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Results</h2>

      {/* Embed the HistogramSection here */}
      <HistogramSection />

      {/* Display table of all of the results here */}
      {/* Assuming you will populate the table with data fetched after the benchmarking */}
    </section>
  );
}

export default ResultsSection;
