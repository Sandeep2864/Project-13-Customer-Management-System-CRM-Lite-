import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="bg-crm"></div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl glass space-y-8">

        <h2 className="text-3xl font-display text-center text-white animate-fadeIn">
          CRM Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              className="input-line"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="input-label">Email</label>
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              className="input-line"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="input-label">Password</label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-white
                       bg-brand-600 hover:bg-brand-500
                       transition-all duration-300
                       hover:scale-105 active:scale-95
                       shadow-lg shadow-brand-600/30"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;