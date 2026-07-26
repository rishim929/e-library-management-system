import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword, verifyOTP, resetPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await forgotPassword({ email });
      setMessage({ text: res.data.message || "OTP code sent to your email!", type: "success" });
      setStep(2);
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Failed to send OTP. Please check your email.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await verifyOTP({ email, otp });
      setMessage({ text: res.data.message || "OTP verified!", type: "success" });
      setStep(3);
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Invalid or expired OTP code.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await resetPassword({ email, otp, newPassword });
      alert(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Failed to reset password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-green-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Forgot Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1 && "Enter your email address to receive a 6-digit OTP code."}
            {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
            {step === 3 && "Create a new password for your account."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className={`flex items-center space-x-2 ${step >= 1 ? "text-green-700 font-bold" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-green-100 border border-green-600 flex items-center justify-center text-xs">1</span>
            <span>Email</span>
          </div>
          <div className="h-0.5 w-8 bg-gray-200"></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? "text-green-700 font-bold" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-green-100 border border-green-600 flex items-center justify-center text-xs">2</span>
            <span>OTP</span>
          </div>
          <div className="h-0.5 w-8 bg-gray-200"></div>
          <div className={`flex items-center space-x-2 ${step >= 3 ? "text-green-700 font-bold" : "text-gray-400"}`}>
            <span className="w-6 h-6 rounded-full bg-green-100 border border-green-600 flex items-center justify-center text-xs">3</span>
            <span>Reset</span>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP Code"}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest font-mono text-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP Code"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 text-sm text-gray-600 hover:text-green-700 text-center block"
            >
              Change Email Address
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-green-700 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
