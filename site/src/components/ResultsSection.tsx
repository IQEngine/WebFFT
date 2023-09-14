import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { BallTriangle } from "react-loader-spinner";

// Registering the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  benchmarkData: any;
  loading: boolean;
}

function ResultsSection({ benchmarkData, loading }: Props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
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
        ticks: {
          font: {
            size: 16,
          },
          color: `hsla(0, 0%, 80%, 0.9)`,
        },
      },
    },
  };

  return (
    <section className="mb-6 text-center">
      <div className="max-w-2xl max-h-screen mx-auto p-4">
        <h2 className="text-xl">Results</h2>

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
              <Bar data={benchmarkData} options={options} height={425} />
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
