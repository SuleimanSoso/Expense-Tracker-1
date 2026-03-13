import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function TrendChart({ data }) {
  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Spending",
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
        Spending Trend
      </h3>
      <Line data={chartData} />
    </div>
  );
}
