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
        display: true,
        text: "Test Results",
      },
    },
  };

  return (
    <section className="mb-6 text-center">
      <div className="max-w-lg max-h-screen mx-auto p-4">
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
            <div className="max-w-lg h-64 mx-auto p-4">
              <Bar data={benchmarkData} options={options} />
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
