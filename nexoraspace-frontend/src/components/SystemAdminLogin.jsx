// src/pages/SystemAdminLogin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // adjust path if your instance is elsewhere

export default function SystemAdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true); // checking existing session on mount
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On mount: check /api/auth/check to see if token cookie exists & is valid
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/api/auth/check"); // uses baseURL from your axios instance
        if (!mounted) return;
        if (res.status === 200) {
          // already authenticated -> go to dashboard
          navigate("/system/dashboard");
        } else {
          setChecking(false); // show login form (unlikely for axios but kept for parity)
        }
      } catch (err) {
        // network or 401/403 -> show login form
        if (!mounted) return;
        setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      // axios will treat 2xx as success
      if (res.status === 200) {
        // login successful — cookie already set by server
        navigate("/system/dashboard");
      } else {
        // unlikely, but handle
        setError(res.data?.error || "Invalid credentials");
      }
    } catch (err) {
      // extract server error message if any
      const serverMsg = err?.response?.data?.error;
      if (serverMsg) setError(serverMsg);
      else {
        console.error("Login error:", err);
        setError("Network error — please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
        <div className="text-center">Checking session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-800"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.img
            src="/logo-white.svg"
            alt="NexoraSpace"
            className="h-24 w-auto drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-bold text-yellow-400 tracking-widest mb-8 uppercase">
          System Administrator Login
        </h1>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold text-lg hover:bg-yellow-400 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
