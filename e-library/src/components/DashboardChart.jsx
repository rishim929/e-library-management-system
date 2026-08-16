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
  const basicUsers = Math.max(0, totalUsers - premiumUsers);

  const barData = {
    labels: ["Books Catalog", "Categories"],
    datasets: [
      {
        label: "Library Statistics",
        data: [books, categories],
        backgroundColor: ["rgba(99, 102, 241, 0.85)", "rgba(16, 185, 129, 0.85)"],
        borderColor: ["#4f46e5", "#059669"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#334155", // Dark Slate 700
          font: { weight: "700", size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#334155", // Dark Slate 700
          font: { weight: "700", size: 12 },
          precision: 0,
        },
        grid: {
          color: "#f1f5f9", // Light slate border
        },
      },
    },
  };

  const pieData = {
    labels: ["Basic Users", "Premium VIP Users"],
    datasets: [
      {
        data: [basicUsers, premiumUsers],
        backgroundColor: ["#3b82f6", "#f43f5e"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1e293b", // High contrast dark slate 800
          font: { weight: "700", size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Library Overview Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          📊 Library Overview
        </h2>

        <div className="h-64 sm:h-72 w-full relative">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* User Membership Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          👥 User Membership Distribution
        </h2>

        <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;