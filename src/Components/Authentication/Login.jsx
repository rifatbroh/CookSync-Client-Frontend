import { useState } from "react";
import axios from "../../utils/axios"; // Adjust the import path as necessary

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            await axios.post("/auth/send-otp", { email });
            setMessage("OTP sent. Please check your email.");
            setStep(2);
        } catch (error) {
            setMessage(error?.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/auth/verify-otp", { email, otp });
            localStorage.setItem("token", res.data.token);
            setMessage("Login successful!");
            // Redirect or trigger login state
        } catch (error) {
            setMessage(error?.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Login
                </h2>

                {step === 1 ? (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            {loading ? "Verifying..." : "Verify OTP & Login"}
                        </button>
                    </>
                )}

                {message && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
