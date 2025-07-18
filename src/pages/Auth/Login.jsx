import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance"; // ✅ centralized axios

const Login = ({ setLoggedInUser }) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axiosInstance.post("/user/login", credentials);

      if (data.success) {
        const decodedUser = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        setLoggedInUser(decodedUser);
        toast.success("Login successful!");
        navigate("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto shadow p-4 rounded">
          <h2 className="mb-4 text-center">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>
          <div className="d-flex justify-content-center align-items-center mt-4">
            <span>
              Don't have an account? Register
              <a href="/register" className="text-decoration-none">
                {" "}
                here{" "}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
