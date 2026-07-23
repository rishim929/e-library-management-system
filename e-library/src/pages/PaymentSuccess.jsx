import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/paymentService";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const pidx = searchParams.get("pidx");

        if (!pidx) {
          alert("Invalid payment.");
          navigate("/user/subscription");
          return;
        }

        await verifyPayment(pidx);

        const user = JSON.parse(localStorage.getItem("user"));

        user.membership_type = "premium";

        localStorage.setItem("user", JSON.stringify(user));

        alert("🎉 Payment Successful! Premium Activated.");

        navigate("/user/subscription");
      } catch (err) {
        console.error(err);
        alert("Payment verification failed.");
        navigate("/user/subscription");
      }
    };

    verify();
  }, []);

  return <h2 style={{ padding: "40px" }}>Verifying Payment...</h2>;
}

export default PaymentSuccess;