import React, { useEffect, useState } from "react";
import { MockTestResultsType } from "../types/types";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registering the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ResultsSection({ benchmarkData }: { benchmarkData: MockTestResultsType | null }) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (benchmarkData) {
      // Create a list of unique labels for the x-axis
      const newLabels = Array.from(
        new Set(benchmarkData.results.map((item) => `${item.browserInfo.browserName},${item.FFTSize}`))
      );

      // Create datasets for the bar chart
      const datasets = [
        {
          label: "Results",
          data: benchmarkData.results.map((item) => item.testResult),
          backgroundColor: newLabels.map((label) => getBrowserColor(label.split(",")[0])),
          borderColor: newLabels.map(() => `hsla(0, 0%, 80%, 0.9)`),
          borderWidth: 1
        }
      ];

      setChartData({
        labels: newLabels,
        datasets: datasets
      });
    }
  }, [benchmarkData]);

  // Get the color for each browser
  const getBrowserColor = (browserName: string) => {
    switch (browserName) {
      case "Edge":
        return `hsl(200, 100%, 50%, 0.75)`;
      case "Mozilla":
        return `hsla(320, 80%, 50%, 0.8)`;
      case "Chrome":
        return `hsla(50, 100%, 60%, 0.75)`;
      default:
        return "hsl(0, 0%, 50%, 0.75)";
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false
      },
      title: {
        display: true,
        text: "Test Results"
      }
    }
  };

  return (
    <section className="mb-6 text-center">
      <div className="max-w-lg max-h-screen mx-auto p-4">
        <h2 className="text-xl">Results</h2>

        {chartData && (
          <section className="mb-6 text-center">
            <div className="max-w-lg max-h-96 mx-auto p-4">
              <Bar data={chartData} options={options} />
            </div>
          </section>
        )}

        {/* Display table of all of the results here */}
        {/* Assuming you will populate the table with data fetched after the benchmarking */}
      </div>
    </section>
  );
}

export default ResultsSection;
