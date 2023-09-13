import { ProfileResult } from "webfft";
import { MockTestResultsType } from "../types/types";
import HistogramSection from "./HistogramSection";
import { BallTriangle } from "react-loader-spinner";

function ResultsSection({ benchmarkData, loading }: { benchmarkData: ProfileResult | null; loading: boolean }) {
  return (
    <section className="mb-6 text-center">
      <div className="max-w-lg max-h-screen mx-auto p-4">
        <h2 className="text-xl">Results</h2>

        {/* Embed the HistogramSection here */}
        {benchmarkData && <HistogramSection data={benchmarkData} />}
        <div className="max-w-lg max-h-96 mx-auto p-4">
          {loading && (
            <BallTriangle
              height={150}
              width={150}
              radius={6}
              color="#4fa94d"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{ justifyContent: "center" }}
              visible={true}
            />
          )}
        </div>

        {/* Display table of all of the results here */}
        {/* Assuming you will populate the table with data fetched after the benchmarking */}
      </div>
    </section>
  );
}

export default ResultsSection;
