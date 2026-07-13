import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function DashboardChart({
  books,
  categories,
  totalUsers,
  premiumUsers,
}) {
  const basicUsers = totalUsers - premiumUsers;

  const barData = {
    labels: ["Books", "Categories"],
    datasets: [
      {
        label: "Library Statistics",
        data: [books, categories],
      },
    ],
  };

  const pieData = {
    labels: ["Basic Users", "Premium Users"],
    datasets: [
      {
        data: [basicUsers, premiumUsers],
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Library Overview
        </h2>

        <Bar data={barData} />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          User Membership
        </h2>

        <Pie data={pieData} />
      </div>
    </div>
  );
}

export default DashboardChart;