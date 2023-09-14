import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registering the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  benchmarkData: any;
}

function ResultsSection({ benchmarkData }: Props) {
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
