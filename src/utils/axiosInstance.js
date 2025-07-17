import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ change this to your actual base URL
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // force redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
