import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { ProfileResult } from "webfft";

// Registering the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type HistogramSectionProps = {
  data: ProfileResult;
};

function HistogramSection({ data }: HistogramSectionProps) {
  // Create a list of unique labels for the x-axis
  const labels = data.subLibraries;

  // Get the color for each browser
  const getLibraryColor = (libraryName: string) => {
    if (libraryName.includes("Javascript")) {
      return `hsl(200, 100%, 50%, 0.75)`; // blue
    }
    return `hsla(320, 80%, 50%, 0.8)`; // pink

    //`hsla(50, 100%, 60%, 0.75)` yellow
  };

  // Create datasets for the bar chart
  const datasets = [
    {
      label: "Test Results",
      data: data.ffsPerSecond,
      backgroundColor: labels.map((label) =>
        label == data.fastestSubLibrary ? `hsla(50, 100%, 60%, 0.75)` : getLibraryColor(label)
      ),
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
