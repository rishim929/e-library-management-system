import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { upgradeSubscription } from "../services/subscriptionService";

function Subscriptions() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      await upgradeSubscription();

      const user = JSON.parse(localStorage.getItem("user"));
      user.membership_type = "premium";
      localStorage.setItem("user", JSON.stringify(user));

      alert("Subscription upgraded successfully!");

      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        Subscription
      </h1>

      <div className="bg-white rounded-xl shadow p-8 max-w-xl">

        <h2 className="text-2xl font-bold mb-4">
          Current Plan
        </h2>

        <p className="text-xl mb-6">
          {user?.membership_type?.toUpperCase()}
        </p>

        {user?.membership_type === "premium" ? (
          <button
            disabled
            className="bg-gray-500 text-white px-6 py-3 rounded"
          >
            Premium Active
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-green-700 text-white px-6 py-3 rounded"
          >
            {loading ? "Upgrading..." : "Upgrade to Premium"}
          </button>
        )}

      </div>
    </AdminLayout>
  );
}

export default Subscriptions;