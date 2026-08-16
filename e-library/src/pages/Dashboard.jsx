import { useEffect, useState } from "react";
import AdminLayout from "../Layouts/Adminlayouts";
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
  const [loading, setLoading] = useState(true);

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

      setBooks(bookRes.data.totalBooks || 0);
      setCategories(categoryRes.data.totalCategories || 0);
      setUsers(userRes.data.totalUsers || 0);
      setPremiumUsers(premiumRes.data.premiumUsers || 0);
      setSubscriptions(subscriptionRes.data.activeSubscriptions || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time library statistics & analytics overview
          </p>
        </div>

        <button
          onClick={loadStats}
          className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 shadow-sm transition"
        >
          🔄 Refresh Stats
        </button>
      </div>

      {/* Top 5 Statistics Cards Grid - CLEAN RESPONSIVE ALIGNMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Books" value={books} icon="📚" color="text-indigo-600" />
        <StatCard title="Categories" value={categories} icon="📂" color="text-amber-600" />
        <StatCard title="Total Users" value={users} icon="👥" color="text-emerald-600" />
        <StatCard title="Premium Users" value={premiumUsers} icon="💎" color="text-rose-600" />
        <StatCard title="Active Subs" value={subscriptions} icon="🟢" color="text-sky-600" />
      </div>

      {/* Dashboard Charts */}
      <DashboardChart
        books={books}
        categories={categories}
        totalUsers={users}
        premiumUsers={premiumUsers}
      />

      {/* Welcome Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm mt-8 sm:mt-10 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🏛️</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            Welcome to E-Library Management System
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          This control panel provides real-time access to your book catalog, category taxonomy, user memberships, subscription transactions, and system analytics.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;