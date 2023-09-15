import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { BallTriangle } from "react-loader-spinner";

// Registering the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  benchmarkData: any;
  loading: boolean;
}

function ResultsSection({ benchmarkData, loading }: Props) {
  // Modify and sort benchmark data before using it in the chart
  if (benchmarkData) {
    benchmarkData.labels = benchmarkData.labels.map((label: string) =>
      label.replace(/(javascript|wasm)/gi, ""),
    );

    //   const dataPoints = benchmarkData.datasets[0].data;
    //   const sortedIndices = dataPoints
    //     .map((_: any, index: number) => index)
    //     .sort(
    //       (a: string | number, b: string | number) =>
    //         dataPoints[b] - dataPoints[a],
    //     );

    //   benchmarkData.labels = sortedIndices.map(
    //     (index: number) => benchmarkData.labels[index],
    //   );
    //   benchmarkData.datasets[0].data = sortedIndices.map(
    //     (index: number) => dataPoints[index],
    //   );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: true,
      },
      title: {
        display: false,
        text: "Test Results",
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          font: {
            size: 16,
          },
          color: `hsla(0, 0%, 80%, 0.9)`,
          text: "FFTs per Second",
        },
      },
      x: {
        display: true,
        title: {
          display: true,
          font: {
            size: 16,
          },
          color: `hsla(0, 0%, 80%, 0.9)`,
          text: "FFT Algorithms",
        },
        ticks: {
          display: true,
          font: {
            size: 10,
          },
          color: `hsla(0, 0%, 80%, 0.9)`,
        },
      },
    },
  };

  return (
    <section className="mb-6 text-center">
      <div className="max-w-2xl max-h-screen mx-auto p-4">
        {(loading || benchmarkData) && (
          <h2
            className="text-xl"
            aria-describedby="Your FFT Benchmark Results Appear Below"
          >
            Results
          </h2>
        )}

        {loading && (
          <BallTriangle
            height={200}
            width={200}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{ justifyContent: "center" }}
            visible={true}
          />
        )}

        {benchmarkData && (
          <section className="mb-6 text-center">
            <div className="min-h-full mx-auto p-4">
              <Bar
                data={benchmarkData}
                options={options}
                height={425}
                aria-label="Benchmark Histogram Results for FFT per Second by Algorithm"
                role="img"
              />
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
