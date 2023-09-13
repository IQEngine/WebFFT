import { MockTestResultsType } from "../types/types";
import HistogramSection from "./HistogramSection";

function ResultsSection({ benchmarkData }: { benchmarkData: MockTestResultsType | null }) {
  return (
    <section className="mb-6 text-center">
      <div className="max-w-lg max-h-screen mx-auto p-4">
        <h2 className="text-xl">Results</h2>

        {/* Embed the HistogramSection here */}
        {benchmarkData && <HistogramSection data={benchmarkData} />}

        {/* Display table of all of the results here */}
        {/* Assuming you will populate the table with data fetched after the benchmarking */}
      </div>
    </section>
  );
}

export default ResultsSection;
