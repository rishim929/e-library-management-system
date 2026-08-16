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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-2xl mx-auto mb-3">
            🔑
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            Forgot Password
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 1 && "Enter your email address to receive a 6-digit OTP code."}
            {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
            {step === 3 && "Create a new password for your account."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className={`flex items-center space-x-2 ${step >= 1 ? "text-indigo-400 font-bold" : "text-slate-500"}`}>
            <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xs">1</span>
            <span className="text-xs">Email</span>
          </div>
          <div className="h-0.5 w-6 bg-slate-800"></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? "text-indigo-400 font-bold" : "text-slate-500"}`}>
            <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xs">2</span>
            <span className="text-xs">OTP</span>
          </div>
          <div className="h-0.5 w-6 bg-slate-800"></div>
          <div className={`flex items-center space-x-2 ${step >= 3 ? "text-indigo-400 font-bold" : "text-slate-500"}`}>
            <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xs">3</span>
            <span className="text-xs">Reset</span>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 ${
              message.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Registered Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold p-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP Code"}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl text-center tracking-widest font-mono text-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold p-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP Code"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 text-xs text-slate-400 hover:text-indigo-400 text-center block"
            >
              Change Email Address
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold p-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-extrabold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
