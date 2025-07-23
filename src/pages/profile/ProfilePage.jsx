import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ProfilePage = ({ loggedInUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [fieldsEnabled, setFieldsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!loggedInUser) {
    return (
      <div className="container text-center mt-5">
        <h3>Please log in to view your profile.</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  const handleOpenModal = () => {
    setEmailForReset(loggedInUser.email);
    setShowModal(true);
    setFieldsEnabled(false);
    setReceivedOtp("");
    setNewPassword("");
  };

  const handleOtpSend = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/forgot-password`,
        { email: emailForReset }
      );

      if (data.success) {
        toast.success("OTP has been sent successfully.");
        setFieldsEnabled(true);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handlePasswordReset = async () => {
    if (!receivedOtp.trim() || !newPassword.trim()) {
      toast.info("Please enter OTP and new password.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/reset-password`,
        {
          email: emailForReset,
          otp: receivedOtp.trim(),
          password: newPassword.trim(),
        }
      );

      if (data.success) {
        toast.success("Password updated successfully.");
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("An error occurred while updating password.");
    }
  };

  const {
    name,
    email,
    phone,
    dob,
    gender,
    profileImage,
    role,
    address = {},
  } = loggedInUser;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src={
              profileImage ||
              "https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=880&auto=format&fit=crop"
            }
            alt="Profile"
            className="rounded-circle object-fit-cover"
            width="120"
            height="120"
          />
        </div>

        <h4 className="text-center mb-3">{name}</h4>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {email}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {phone || "Not provided"}
          </li>
          <li className="list-group-item">
            <strong>Date of Birth:</strong>{" "}
            {dob ? new Date(dob).toLocaleDateString("en-GB") : "Not provided"}
          </li>
          <li className="list-group-item">
            <strong>Gender:</strong> {gender || "Not specified"}
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>
              <strong>Reset my password:</strong> **********
            </span>
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleOpenModal}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </span>
          </li>
          <li className="list-group-item">
            <strong>Role:</strong> {role || "User"}
          </li>
        </ul>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Update Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <div className="d-flex gap-2">
                    <input
                      type="email"
                      className="form-control"
                      value={emailForReset}
                      disabled
                    />
                    <button className="btn btn-primary" onClick={handleOtpSend}>
                      Send OTP
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={receivedOtp}
                    onChange={(e) => setReceivedOtp(e.target.value)}
                    disabled={!fieldsEnabled}
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
                    disabled={!fieldsEnabled}
                  />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePasswordReset}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
