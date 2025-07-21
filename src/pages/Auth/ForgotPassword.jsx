import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      await axiosInstance.post("/user/forgot-password", { email }); // ✅ relative path
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      return toast.error("Please fill in OTP and new password");
    }

    try {
      setLoading(true);
      await axiosInstance.post("/user/reset-password", {
        email,
        otp,
        password: newPassword,
      });
      toast.success("Password reset successful");

      // Reset form
      setEmail("");
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-4">Forgot Password</h4>

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
              required
            />
          </div>

          {!otpSent && (
            <button
              type="button"
              className="btn btn-primary w-100 mb-3"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          <div className="mb-3">
            <label className="form-label">OTP</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={!otpSent}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!otpSent}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={!otpSent || loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
