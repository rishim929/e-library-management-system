import { useState } from "react";
import UserLayout from "../layouts/UserLayout";
import { initiatePayment } from "../services/paymentService";

function Payment() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await initiatePayment();

      // Redirect to Khalti Checkout
      window.location.href = res.data.data.payment_url;
    } catch (err) {
      console.error(err);
      alert("Failed to initiate Khalti payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          Payment
        </h1>

        <p className="mb-6">
          Premium Membership
        </p>

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Rs. 50 
        </h2>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800"
        >
          {loading ? "Redirecting..." : "Pay with Khalti"}
        </button>
      </div>
    </UserLayout>
  );
}

export default Payment;