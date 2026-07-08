import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getSubscriptions } from "../services/subscriptionService";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  const loadSubscriptions = async () => {
    try {
      const res = await getSubscriptions();
      setSubscriptions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">
        Subscription Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b">
                  <td className="p-3">{sub.id}</td>
                  <td>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.membership_type}</td>
                  <td>{sub.status}</td>
                  <td>
                    {new Date(sub.start_date).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(sub.end_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6">
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Subscriptions;