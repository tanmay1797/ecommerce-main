import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState(null); // ✅ for image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      toast.error("Profile image is required");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(userDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("profileImage", profileImage); // ✅ append image

      const { data } = await axiosInstance.post("/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Registration successful! Kindly Login Now");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto shadow p-4 rounded">
          <h2 className="mb-4 text-center">Register Here</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                placeholder="Enter email"
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
                value={userDetails.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                name="dob"
                value={userDetails.dob}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={userDetails.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                className="form-control"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>

          <div className="d-flex justify-content-center align-items-center mt-4">
            <span>
              Already a user? Login{" "}
              <button
                onClick={() => navigate("/login")}
                className="btn btn-link p-0 m-0"
              >
                here
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
