// Login.jsx
import { useState } from "react";
import Logo from "../Single Component/Logo";
import axios from "../utils/axios";

const Login = ({ onClose, navigate, onLoginSuccess }) => { // Add onLoginSuccess prop
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await axios.post("/auth/send-otp", { email });
      setMessage("✅ OTP sent. Please check your email.");
      setStep(2);
    } catch (error) {
      setMessage(error?.response?.data?.error || "❌ Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });
      const token = res.data.token;
      localStorage.setItem("token", token);

      const profileRes = await axios.get("users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("user", JSON.stringify(profileRes.data));

      setMessage("🎉 Login successful!");
      setTimeout(() => {
        onLoginSuccess(); // Call onLoginSuccess here
        onClose();
      }, 1200);
    } catch (error) {
      setMessage(error?.response?.data?.error || "❌ Verification failed");
      // ❌ Do NOT redirect on OTP failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Welcome back to <span className="text-green-700">CookSync</span>
        </h2>

        <div className="space-y-4">
          {step === 1 ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading || !otp}
                className="w-full bg-[#008236] text-white py-2 rounded-md hover:bg-[#0d542b] transition"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </>
          )}

          {message && (
            <p className="text-center text-sm text-gray-700 mt-2 animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;