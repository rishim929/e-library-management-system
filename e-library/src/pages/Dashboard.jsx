import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="📚 Total Books" value="0" />
        <StatCard title="📂 Categories" value="0" />
        <StatCard title="👥 Users" value="0" />
        <StatCard title="💰 Revenue" value="Rs.0" />
      </div>

      <div className="bg-white rounded-xl shadow mt-10 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to E-Library Management System
        </h2>

        <p className="text-gray-600">
          This dashboard will display statistics, recently added books,
          active users, reports, and charts as we build the project.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;