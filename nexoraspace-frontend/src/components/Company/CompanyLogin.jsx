import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Github, Linkedin, Mail, X } from "lucide-react";

// File: CompanyLogin.jsx
// Polished, modern, professional login page for CEO/Admin
// - Centered "Leadership Access Portal" on the left panel
// - "Contact Sales" renamed to "Contact Developer" and opens a modal with dev card
// - "Forgot?" opens a secure, modern forgot-password modal (no separate page)
// - Uses logo: http://localhost:5173/logo-white.svg

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showDevModal, setShowDevModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Login failed. Check your credentials.");
      }

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
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
      setForgotSent(false);
      setError("Please enter a valid email for password reset.");
      return;
    }
    setError("");
    try {
      // Replace with your real endpoint
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch (err) {
      setError("Unable to send reset email. Try again later.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden flex items-center justify-center font-sans">
      {/* Background effects */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black animate-gradient" />
        <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.05)_1px,transparent_1px)] bg-[length:40px_40px] animate-[moveBg_30s_linear_infinite]" />
      </div>
      <style>
        {`
          @keyframes moveBg {
            from { transform: translate(0, 0); }
            to { transform: translate(-40px, -40px); }
          }
          .animate-gradient {
            background-size: 400% 400%;
            animation: gradientMove 18s ease infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-6"
      >
        {/* Left: Branding/Info (center the heading) */}
        <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl bg-gray-900/60 border border-gray-800 shadow-2xl backdrop-blur-xl p-10 text-center">
          <img src="/logo-white.svg" alt="logo" className="h-25 w-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-yellow-400 mb-4 leading-snug">Leadership Access Portal</h2>
          <p className="text-gray-300 mb-8 leading-relaxed max-w-lg">
            Welcome to the secure company portal. This login is strictly reserved for
            <span className="text-yellow-300 font-semibold"> company executives & admins</span>.
            Manage projects, oversee analytics, and configure security — all in one place.
          </p>
          <ul className="space-y-4 text-gray-300 text-sm max-w-md">
            <li className="flex items-start gap-3 justify-start">
              <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Enterprise-grade security, role-based access, and full audit logs.</span>
            </li>
            <li className="flex items-start gap-3 justify-start">
              <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
              <span>Two-factor authentication & Single Sign-On support.</span>
            </li>
          </ul>
        </div>

        {/* Right: Login Form */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="lg:hidden text-center mb-6">
              <img src="/logo-white.svg" alt="logo" className="mx-auto h-23 w-auto mb-4" />
              <h1 className="text-2xl font-bold">Company Login</h1>
              <p className="text-sm text-gray-400 mt-2">Sign in with your credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg bg-gray-950/50 border border-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg bg-gray-950/50 border border-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-yellow-400 focus:ring-yellow-400"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <button onClick={handleOpenForgot} className="text-yellow-300 hover:underline text-sm">Forgot?</button>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-full bg-yellow-500 text-black font-semibold px-5 py-2.5 hover:shadow-lg hover:shadow-yellow-400/30 transition disabled:opacity-60"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                <span>{loading ? "Signing in..." : "Sign in"}</span>
              </button>

              <div className="text-center text-sm text-gray-400">
                Need access? <button onClick={handleContactDeveloper} className="text-yellow-300 hover:underline">Contact Developer</button>
              </div>
            </form>

            <div className="mt-6 text-xs text-gray-500 text-center border-t border-gray-800 pt-4">
              By signing in, you agree to the company’s policies. Unauthorized use is strictly prohibited.
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Developer Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/95 p-6 rounded-xl shadow-2xl max-w-sm w-full relative">
            <button onClick={() => setShowDevModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400">
              <X className="w-6 h-6" />
            </button>

            <section className="py-2 px-2 text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-6">Meet the Creator</h2>

              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="bg-gray-900/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/30 transition max-w-sm mx-auto">
                <img src="https://vishalsharmadev.in/normalphotos/vishal.jpg" alt="Vishal Sharma" className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400 object-cover" />
                <h3 className="text-xl font-semibold mb-1">Vishal Sharma</h3>
                <p className="text-gray-400 text-sm mb-3">Full Stack Developer | Creator of NexoraSpace</p>
                <p className="text-gray-300 text-sm mb-4">📧 contact@vishalsharmadev.in</p>
                <div className="flex justify-center gap-5 text-gray-400">
                  <a href="https://github.com/vishal-r-sharma" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 hover:text-yellow-400 transition" />
                  </a>
                  <a href="https://linkedin.com/in/vishal-r-sharma" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 hover:text-yellow-400 transition" />
                  </a>
                  <a href="mailto:contact@vishalsharmadev.in">
                    <Mail className="w-5 h-5 hover:text-yellow-400 transition" />
                  </a>
                </div>
              </motion.div>
            </section>
          </motion.div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/95 p-6 rounded-xl shadow-2xl max-w-md w-full relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Reset your password</h3>
                <p className="text-sm text-gray-400">We’ll send a secure password reset link to your email. This link expires in 30 minutes.</p>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-400 hover:text-yellow-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReset} className="mt-4 space-y-4">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm text-gray-300">Email address</label>
                <input id="forgotEmail" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required className="mt-2 w-full rounded-lg bg-gray-950/50 border border-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="you@company.com" />
              </div>

              {forgotSent ? (
                <div className="text-sm text-green-400">If the email exists, a secure reset link has been sent. Check your inbox and spam folder.</div>
              ) : (
                <div className="flex items-center gap-3">
                  <button type="submit" className="inline-flex items-center justify-center rounded-full bg-yellow-500 text-black font-semibold px-4 py-2 hover:shadow-lg transition">Send reset link</button>
                  <button type="button" onClick={() => { setForgotSent(false); setShowForgotModal(false); }} className="text-sm text-gray-300 hover:underline">Cancel</button>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-400">This form uses industry-standard reset links and tokens. If you need assistance, contact support.</div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
