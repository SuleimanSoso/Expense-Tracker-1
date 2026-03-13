import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        labels: "Expenses by category",
        data: data.map((item) => item.total),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Category Breakdown
      </h3>
      <Pie data={chartData} />
    </div>
  );
}
