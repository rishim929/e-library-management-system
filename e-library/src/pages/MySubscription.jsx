import { useState } from "react";
import UserLayout from "../layouts/UserLayout";
import { upgradeSubscription } from "../services/subscriptionService";

function MySubscription() {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      await upgradeSubscription();

      const updatedUser = {
        ...user,
        membership_type: "premium",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      alert("🎉 Congratulations! Your membership has been upgraded to Premium.");
    } catch (err) {
      console.log(err);
      alert("Failed to upgrade membership.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-6">
        💎 My Subscription
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Current Plan
        </h2>

        <p className="text-2xl font-bold mb-6">
          <span
            className={
              user?.membership_type === "premium"
                ? "text-green-700"
                : "text-blue-700"
            }
          >
            {user?.membership_type?.toUpperCase() || "BASIC"}
          </span>
        </p>

        {user?.membership_type === "premium" ? (
          <>
            <button
              disabled
              className="w-full bg-green-700 text-white py-3 rounded cursor-not-allowed"
            >
              ✅ Premium Active
            </button>

            <p className="text-green-600 mt-4 text-center">
              You have access to all premium books.
            </p>
          </>
        ) : (
          <>
            <button
             onClick={() => {
  window.location.href = "/user/payment";
}}
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800"
            >
              {loading
                ? "Upgrading..."
                : "⬆ Upgrade to Premium"}
            </button>

            <p className="text-gray-600 mt-4 text-center">
              Upgrade your membership to unlock premium books.
            </p>
          </>
        )}
      </div>
    </UserLayout>
  );
}

export default MySubscription;