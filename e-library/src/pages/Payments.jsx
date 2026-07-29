import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";
import AdminLayout from "../Layouts/Adminlayouts";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Payment History
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="p-3">{payment.name}</td>
                <td>{payment.email}</td>
                <td>Rs. {payment.amount}</td>
                <td>{payment.payment_method}</td>
                <td>{payment.transaction_id}</td>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Payments;