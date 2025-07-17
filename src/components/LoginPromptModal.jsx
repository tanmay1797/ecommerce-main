import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPromptModal({ show, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });

      const data = res.data;

      if (res.status === 200 && data.success && data.token) {
        const decodedUser = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        onLoginSuccess(decodedUser);
        onClose();
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Login Required</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleLogin}>
            <div className="modal-body">
              <p>You must be logged in to add items to your cart.</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    onClose();
                    navigate("/register");
                  }}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loggingIn}
              >
                {loggingIn ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
