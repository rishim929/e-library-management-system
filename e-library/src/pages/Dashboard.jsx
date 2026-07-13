import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";
import DashboardChart from "../components/DashboardChart";

import {
  getBookCount,
  getCategoryCount,
  getUserCount,
  getPremiumUserCount,
  getSubscriptionCount,
} from "../services/dashboardService";

function Dashboard() {
  const [books, setBooks] = useState(0);
  const [categories, setCategories] = useState(0);
  const [users, setUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);

  const loadStats = async () => {
    try {
      const [
        bookRes,
        categoryRes,
        userRes,
        premiumRes,
        subscriptionRes,
      ] = await Promise.all([
        getBookCount(),
        getCategoryCount(),
        getUserCount(),
        getPremiumUserCount(),
        getSubscriptionCount(),
      ]);

      setBooks(bookRes.data.totalBooks);
      setCategories(categoryRes.data.totalCategories);
      setUsers(userRes.data.totalUsers);
      setPremiumUsers(premiumRes.data.premiumUsers);
      setSubscriptions(subscriptionRes.data.activeSubscriptions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="📚 Total Books" value={books} />
        <StatCard title="📂 Categories" value={categories} />
        <StatCard title="👥 Total Users" value={users} />
        <StatCard title="💎 Premium Users" value={premiumUsers} />
        <StatCard title="🟢 Active Subs" value={subscriptions} />
      </div>

      {/* Dashboard Charts */}
      <DashboardChart
        books={books}
        categories={categories}
        totalUsers={users}
        premiumUsers={premiumUsers}
      />

      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow mt-10 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to E-Library Management System
        </h2>

        <p className="text-gray-600">
          This dashboard displays live statistics from your database.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;