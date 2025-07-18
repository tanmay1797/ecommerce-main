// src/utils/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: attach token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 403) {
      // Show the toast message
      toast.error("Session expired. Please login again.");

      // Clear token
      localStorage.removeItem("token");

      // Delay redirect to allow toast to be seen
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2 seconds delay
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
