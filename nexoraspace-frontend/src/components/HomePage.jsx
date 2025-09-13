import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    BarChart3,
    Users,
    Calendar,
    Cpu,
    Lock,
    Github,
    Linkedin,
    Mail,
    ArrowRight,
    Rocket,
    Activity,
    LineChart,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"

export default function HomePage() {
    const navigate = useNavigate();
    const [showContact, setShowContact] = useState(false);

    const handleUserLoginClick = async () => {
        try {
            // In dev: /api/auth/check → proxied to localhost:5000
            // In prod: https://api.nexoraspace.vishalsharmadev.in/api/auth/check
            const res = await api.get("/api/auth/check/company")

            if (res.status === 200) {
                // ✅ token valid
                navigate("/company/dashboard")
            } else {
                // ❌ not authenticated (should normally throw instead)
                navigate("/company/login")
            }
        } catch (err) {
            // axios throws on 401/403
            console.error("Auth check failed:", err.response?.status, err.message)
            navigate("/company/login")
        }
    }

    const handleSystemAdminLoginClick = async () => {
        try {
            // Admin auth check — keep same endpoint unless you have a dedicated admin check.
            // Adjust endpoint if your backend requires a different route or query param.
            const res = await api.get("/api/auth/check")

            if (res.status === 200) {
                // Admin token valid
                navigate("/system/dashboard")
            } else {
                navigate("/system/login")
            }
        } catch (err) {
            console.error("Admin auth check failed:", err.response?.status, err.message)
            navigate("/system/login")
        }
    }


    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black animate-gradient" />
                <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.04)_1px,transparent_1px)] bg-[length:40px_40px] animate-[moveBg_25s_linear_infinite]" />
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

            {/* Header */}
            <header className="backdrop-blur-lg bg-gray-900/70 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <img src="/logo-white.svg" alt="NexoraSpace" className="h-10 sm:h-12 w-auto" />

                    {/* Buttons container: responsive, wraps on small devices */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                        <button
                            onClick={() => setShowContact(true)}
                            className="px-4 sm:px-6 py-2 rounded-full bg-gray-800 text-gray-200 border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition text-sm sm:text-base"
                            aria-label="Contact"
                        >
                            Contact
                        </button>

                        {/* System Admin login button */}
                        <button
                            onClick={handleSystemAdminLoginClick}
                            className="px-4 sm:px-6 py-2 rounded-full bg-transparent text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/5 transition text-sm sm:text-base"
                            aria-label="System Admin Login"
                        >
                            Admin Login
                        </button>

                        {/* Regular Login button */}
                        <button
                            onClick={handleUserLoginClick}
                            className="px-4 sm:px-6 py-2 rounded-full bg-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/40 transition text-sm sm:text-base"
                            aria-label="User Login"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-28 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-yellow-400 mb-6">
                            Secure, Scalable <br /> Multi-Tenant SaaS Dashboard
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                            Manage <span className="font-semibold">Projects, Teams & Analytics</span> with{" "}
                            <span className="text-yellow-400">enterprise-grade Security</span> and{" "}
                            <span className="text-yellow-300">AI-powered Insights</span>. Built for startups &
                            enterprises.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate("/company/login")}
                                className="px-7 py-3 rounded-full bg-yellow-500 text-black font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-400/40 transition"
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>
                            <a
                                href="https://github.com/vishal-r-sharma/NexoraSpace"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-7 py-3 rounded-full bg-gray-800 border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition text-white font-medium flex items-center gap-2"
                            >
                                <Github className="w-5 h-5" /> View on GitHub
                            </a>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative"
                    >
                        <img
                            src="/logo-white.svg"
                            alt="Dashboard Preview"
                            className="rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-500/10 to-transparent blur-3xl -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* Why NexoraSpace */}
            <section className="py-20 px-6 bg-gray-900/60">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-14">
                    Why NexoraSpace?
                </h2>
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Rocket,
                            title: "Boost Productivity",
                            desc: "Streamline workflows and manage everything in one place.",
                        },
                        {
                            icon: Shield,
                            title: "Enterprise Security",
                            desc: "PBAC, IP controls, encryption, and audit logs.",
                        },
                        {
                            icon: LineChart,
                            title: "AI Insights",
                            desc: "Predict efficiency and deadlines with real-time analytics.",
                        },
                        {
                            icon: Activity,
                            title: "Scalable",
                            desc: "From startups to enterprises, grow without limits.",
                        },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800/80 p-6 rounded-2xl shadow-lg hover:shadow-yellow-400/30 transition"
                        >
                            <Icon className="text-yellow-400 w-10 h-10 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-gray-400">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-14">
                    Core Features
                </h2>
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: Shield,
                            title: "Advanced Security",
                            desc: "PBAC, IP restrictions, JWT, and audit logs.",
                        },
                        {
                            icon: Users,
                            title: "Multi-Tenant Support",
                            desc: "Onboard multiple organizations securely.",
                        },
                        {
                            icon: BarChart3,
                            title: "AI Analytics",
                            desc: "Predict outcomes, estimate timelines & measure efficiency.",
                        },
                        {
                            icon: Calendar,
                            title: "Smart Calendar",
                            desc: "Manage milestones with Google Calendar integration.",
                        },
                        {
                            icon: Cpu,
                            title: "High Scalability",
                            desc: "Powered by React, Node.js, and MongoDB Atlas.",
                        },
                        {
                            icon: Lock,
                            title: "Role-Based Access",
                            desc: "Fine-grained permissions for every role.",
                        },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gray-800/80 to-gray-900/70 border border-gray-700/50 p-6 rounded-2xl shadow hover:shadow-yellow-400/30 transition"
                        >
                            <Icon className="text-yellow-400 w-10 h-10 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-gray-400">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About */}
            <section className="py-20 px-6 bg-gray-900/60">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                            About NexoraSpace
                        </h2>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                            Organizations juggle multiple tools for{" "}
                            <span className="font-semibold">projects, analytics, and security</span>.
                            Many of these lack <span className="text-yellow-400">multi-tenancy</span>,
                            compromise <span className="text-yellow-400">data protection</span>, or fail
                            to deliver <span className="text-yellow-300"> predictive insights</span>.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            <span className="font-semibold text-yellow-300">NexoraSpace</span> unifies
                            project management, predictive AI analytics, and secure multi-tenancy — built
                            for scalability, efficiency, and enterprise-grade security.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <img
                            src="/logo-white.svg"
                            alt="About illustration"
                            className="rounded-2xl shadow-lg border border-gray-800"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Developer Section (Smaller Card) */}
            <section className="py-20 px-6 text-center max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-yellow-400 mb-12">Meet the Creator</h2>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/80 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/30 transition max-w-sm mx-auto"
                >
                    <img
                        src="https://vishalsharmadev.in/normalphotos/vishal.jpg"
                        alt="Vishal Sharma"
                        className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-1">Vishal Sharma</h3>
                    <p className="text-gray-400 text-sm mb-3">
                        Full Stack Developer | Creator of NexoraSpace
                    </p>
                    <p className="text-gray-300 text-sm mb-4">📧 contact@vishalsharmadev.in</p>
                    <div className="flex justify-center gap-5 text-gray-400">
                        <a
                            href="https://github.com/vishal-r-sharma"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-5 h-5 hover:text-yellow-400 transition" />
                        </a>
                        <a
                            href="https://linkedin.com/in/vishal-r-sharma"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className="w-5 h-5 hover:text-yellow-400 transition" />
                        </a>
                        <a href="mailto:contact@vishalsharmadev.in">
                            <Mail className="w-5 h-5 hover:text-yellow-400 transition" />
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-gray-800 text-center py-6">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} NexoraSpace. Built with ❤️ by Vishal Sharma.
                </p>
            </footer>

            {/* Contact Modal */}
            {showContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900/90 p-6 rounded-xl shadow-lg max-w-sm w-full relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowContact(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Reuse Developer Card */}
                        <div className="text-center">
                            <img
                                src="https://vishalsharmadev.in/normalphotos/vishal.jpg"
                                alt="Vishal Sharma"
                                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400 object-cover"
                            />
                            <h3 className="text-xl font-semibold mb-1">Vishal Sharma</h3>
                            <p className="text-gray-400 text-sm mb-3">
                                Full Stack Developer | Creator of NexoraSpace
                            </p>
                            <p className="text-gray-300 text-sm mb-4">
                                📧 contact@vishalsharmadev.in
                            </p>
                            <div className="flex justify-center gap-5 text-gray-400">
                                <a
                                    href="https://github.com/vishal-r-sharma"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="w-5 h-5 hover:text-yellow-400 transition" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/vishal-r-sharma"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Linkedin className="w-5 h-5 hover:text-yellow-400 transition" />
                                </a>
                                <a href="mailto:contact@vishalsharmadev.in">
                                    <Mail className="w-5 h-5 hover:text-yellow-400 transition" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
