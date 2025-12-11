import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Github, Linkedin, Mail, X } from "lucide-react";
import api from "../../api/axios";
import Cookies from "js-cookie";

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingToken, setCheckingToken] = useState(true);

  const [showDevModal, setShowDevModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // ✅ 1️⃣ On Page Load — check if companytoken is valid
  // ✅ 1️⃣ On Page Load — check if companytoken is valid
  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("Checking token via backend...");
        // just ask backend to verify; no need to read cookie manually
        const res = await api.get("/api/auth/check", { withCredentials: true });

        if (res?.data?.authenticated && res?.data?.user) {
          const user = res.data.user;
          console.log("✅ Valid companytoken found for:", user);
          window.location.href = `/company/${user.role.toLowerCase()}/dashboard/${user._id}/${user.companyRef}`;
        } else {
          console.log("❌ Invalid token, show login form");
          setCheckingToken(false);
        }
      } catch (err) {
        console.error("❌ Token check failed:", err.message);
        setCheckingToken(false);
      }
    };
    verifyToken();
  }, []);


  // ✅ 2️⃣ Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const data = res?.data;
      if (!data?.success || !data?.token) {
        throw new Error(data?.message || "Invalid login response.");
      }

      // // ✅ Save JWT in cookie
      // Cookies.set("companytoken", data.token, {
      //   expires: remember ? 7 : 1,
      //   secure: true,
      //   sameSite: "strict",
      // });

      // ✅ Redirect based on role
      const user = data.user;
      if (!user || !user.role || !user.companyRef) {
        throw new Error("Missing user data in response.");
      }
      const redirectURL = `/company/${user.role.toLowerCase()}/dashboard/${user._id}/${user.companyRef}`;
      window.location.href = redirectURL;

    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleContactDeveloper = (e) => {
    e?.preventDefault();
    setShowDevModal(true);
  };

  const handleOpenForgot = (e) => {
    e?.preventDefault();
    setForgotEmail("");
    setForgotSent(false);
    setShowForgotModal(true);
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(forgotEmail)) {
      setError("Please enter a valid email for password reset.");
      return;
    }
    try {
      await api.post("/api/auth/forgot", { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setError("Unable to send reset link. Try again later.");
    }
  };

  // ✅ 3️⃣ If token is still being verified, show loader
  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ 4️⃣ Login Form
  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden flex items-center justify-center font-sans">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black animate-gradient" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-6"
      >
        {/* Left side info */}
        <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl bg-gray-900/60 border border-gray-800 shadow-2xl backdrop-blur-xl p-10 text-center">
          <img src="/logo-white.svg" alt="logo" className="h-25 w-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-yellow-400 mb-4">
            Leadership Access Portal
          </h2>
          <p className="text-gray-300 mb-8">
            Secure login for{" "}
            <span className="text-yellow-300 font-semibold">
              Admin, Manager & Employee
            </span>
            . Access your dashboard now.
          </p>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex gap-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span>Enterprise-grade role-based access control.</span>
            </li>
            <li className="flex gap-3">
              <Lock className="w-5 h-5 text-yellow-400" />
              <span>Secure authentication & audit logs.</span>
            </li>
          </ul>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="lg:hidden text-center mb-6">
              <img src="/logo-white.svg" alt="logo" className="mx-auto h-23 mb-4" />
              <h1 className="text-2xl font-bold">Company Login</h1>
              <p className="text-sm text-gray-400 mt-2">Sign in securely</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg bg-gray-950/50 border border-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
                  placeholder="admin@zohodemo.in"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg bg-gray-950/50 border border-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
                  placeholder="123456789"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-yellow-400"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <button
                  onClick={handleOpenForgot}
                  className="text-yellow-300 hover:underline"
                >
                  Forgot?
                </button>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-full bg-yellow-500 text-black font-semibold px-5 py-2.5 hover:shadow-lg hover:shadow-yellow-400/30 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Need access?{" "}
              <button
                onClick={handleContactDeveloper}
                className="text-yellow-300 hover:underline"
              >
                Contact Developer
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Developer Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 p-6 rounded-xl shadow-2xl max-w-sm w-full relative"
          >
            <button
              onClick={() => setShowDevModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400"
            >
              <X className="w-6 h-6" />
            </button>
            <section className="py-2 px-2 text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                Meet the Creator
              </h2>
              <motion.div className="bg-gray-900/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/30 transition">
                <img
                  src="https://vishalsharmadev.in/normalphotos/vishal.jpg"
                  alt="Vishal Sharma"
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Vishal Sharma</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Full Stack Developer | Creator of NexoraSpace
                </p>
              </motion.div>
            </section>
          </motion.div>
        </div>
      )}
    </div>
  );
}
