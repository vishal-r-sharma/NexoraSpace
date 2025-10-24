// src/pages/SystemAdminLogin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SystemAdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ✅ On Mount — Verify existing session using systemtoken cookie
   */
  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        const res = await api.get("/api/auth/systemadmin/check", {
          withCredentials: true,
        });

        if (!mounted) return;

        if (res.status === 200 && res.data?.authenticated) {
          console.log("✅ Existing system admin session:", res.data.user);
          // Redirect to dashboard if token valid
          window.location.href = "/system/dashboard";
        } else {
          console.log("🔒 No valid systemtoken found");
          setChecking(false);
        }
      } catch (err) {
        console.log("❌ Auth check failed:", err.response?.data || err.message);
        setChecking(false);
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * 🔐 Handle Login Submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post(
        "/api/auth/systemadmin/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        console.log("✅ Login success:", res.data.user);
        // Force full reload (ensures cookie takes effect)
        window.location.href = "/system/dashboard";
      } else {
        setError(res.data?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🕓 Show loader while verifying session
   */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  /**
   * 💛 Login Form
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
