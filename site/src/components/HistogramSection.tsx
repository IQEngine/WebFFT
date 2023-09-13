import React from "react";
import { Bar } from "react-chartjs-2";
import { MockTestResultsType } from "../types/types";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registering the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type HistogramSectionProps = {
  data: MockTestResultsType;
};

function HistogramSection({ data }: HistogramSectionProps) {
  // Create a list of unique labels for the x-axis
  const labels = Array.from(new Set(data.results.map((item) => `${item.browserInfo.browserName},${item.FFTSize}`)));

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

  // Create datasets for the bar chart
  const datasets = [
    {
      label: "Test Results",
      data: data.results.map((item) => item.testResult),
      backgroundColor: labels.map((label) => getBrowserColor(label.split(",")[0])),
      borderColor: labels.map(() => `hsla(0, 0%, 80%, 0.9)`),
      borderWidth: 1,
    },
  ];

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: true,
        text: "Test Results Histogram",
      },
    },
  };

  return (
    <section className="mb-6 text-center">
      <div className="max-w-lg max-h-96 mx-auto p-4">
        <h2 className="text-xl">Histogram</h2>
        <Bar data={chartData} options={options} />
      </div>
    </section>
  );
}

export default React.memo(HistogramSection);
