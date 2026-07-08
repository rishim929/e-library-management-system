import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

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
      const bookRes = await getBookCount();
      const catRes = await getCategoryCount();
      const userRes = await getUserCount();
      const premiumRes = await getPremiumUserCount();
      const subscriptionRes = await getSubscriptionCount();

      setBooks(bookRes.data.totalBooks);
      setCategories(catRes.data.totalCategories);
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="📚 Total Books" value={books} />
        <StatCard title="📂 Categories" value={categories} />
        <StatCard title="👥 Users" value={users} />
        <StatCard title="💎 Premium Users" value={premiumUsers} />
        <StatCard title="🟢 Subscriptions" value={subscriptions} />
      </div>

      <div className="bg-white rounded-xl shadow mt-10 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to E-Library Management System
        </h2>

        <p className="text-gray-600">
          Monitor books, categories, users, premium memberships,
          and active subscriptions from one place.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;