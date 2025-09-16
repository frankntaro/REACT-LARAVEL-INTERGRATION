import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "./api"; // ✅ use base URL

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    console.log("Close button clicked");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setApiMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });

    if (!validateForm()) {
      setApiMessage({
        type: "error",
        text: "Please correct the errors in the form.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setApiMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        // store token
        localStorage.setItem("userToken", data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data.user));

        setTimeout(() => navigate("/Courses"), 1500);
      } else {
        let errorMessage = data?.error?.message || data?.message || "Login failed.";
        setApiMessage({ type: "error", text: errorMessage });
      }
    } catch (err) {
      console.error("Network error during login:", err);
      setApiMessage({ type: "error", text: "Network error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🔹 your styled JSX unchanged
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/src/assets/reg.jpg')" }}
        ></div>
        <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-lg shadow-xl relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90"></div>
        <div className="relative z-10 p-8">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✖
          </button>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">LOGIN</h2>
          <p className="text-center text-gray-600 mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>

          {apiMessage.text && (
            <div
              className={`p-3 rounded-md mb-6 ${
                apiMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {apiMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
