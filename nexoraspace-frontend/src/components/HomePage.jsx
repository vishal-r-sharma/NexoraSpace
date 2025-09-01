import React from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black animate-gradient" />
                <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.05)_1px,transparent_1px)] bg-[length:40px_40px] animate-[moveBg_20s_linear_infinite]" />
            </div>
            <style>
                {`
          @keyframes moveBg {
            from { transform: translate(0, 0); }
            to { transform: translate(-40px, -40px); }
          }
          .animate-gradient {
            background-size: 400% 400%;
            animation: gradientMove 15s ease infinite;
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
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <img src="/logo-white.svg" alt="NexoraSpace" className="h-12 w-auto" />

                    {/* CTA Login */}
                    <button
                        onClick={() => navigate("/system/login")}
                        className="px-6 py-2 rounded-full bg-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/40 transition">
                        Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative text-center py-28 px-6">
                <motion.img
                    src="/logo-white.svg"
                    alt="NexoraSpace"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="h-40 w-auto mx-auto mb-8 drop-shadow-2xl"
                />

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-3xl md:text-5xl font-extrabold text-yellow-400 tracking-tight"
                >
                    Secure Multi-Tenant SaaS Dashboard
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed"
                >
                    Manage <span className="font-semibold">Projects, Teams & Analytics</span> with
                    enterprise-grade <span className="text-yellow-400">Security</span> and
                    <span className="text-yellow-300"> AI-powered Insights</span>.
                </motion.p>

                {/* GitHub Repo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-10 flex justify-center"
                >
                    <a
                        href="https://github.com/vishal-r-sharma/NexoraSpace"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gray-800 border border-gray-600 hover:border-yellow-400 hover:text-yellow-400 transition text-white font-medium shadow-lg"
                    >
                        <Github className="w-5 h-5" /> View on GitHub
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </section>

            {/* Value Proposition */}
            <section className="py-20 px-6 bg-gray-900/60">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-12">
                    Why NexoraSpace?
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {[
                        { icon: Rocket, title: "Boost Productivity", desc: "Streamline workflows and manage everything in one place." },
                        { icon: Shield, title: "Enterprise Security", desc: "PBAC, IP controls, encryption, and audit logs." },
                        { icon: LineChart, title: "AI Insights", desc: "Predict efficiency and deadlines with real-time analytics." },
                        { icon: Activity, title: "Scalable", desc: "Designed for startups to enterprises with zero compromise." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800/80 p-6 rounded-xl shadow hover:scale-105 hover:shadow-yellow-400/30 transition transform"
                        >
                            <Icon className="text-yellow-400 w-10 h-10 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-gray-400">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-12">
                    About the Project
                </h2>
                <div className="grid md:grid-cols-2 gap-12 text-gray-300 leading-relaxed">
                    <div>
                        <h3 className="text-xl font-semibold text-yellow-300 mb-4">The Problem</h3>
                        <p>
                            Organizations juggle multiple tools for{" "}
                            <span className="font-semibold">projects, analytics, and security</span>.
                            These tools often lack <span className="text-yellow-400">multi-tenancy</span>,
                            compromise on <span className="text-yellow-400">data protection</span>,
                            or fail to deliver <span className="text-yellow-400">predictive insights</span>.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-yellow-300 mb-4">The Solution</h3>
                        <p>
                            <span className="font-semibold text-yellow-300">NexoraSpace</span> integrates
                            project management, predictive AI analytics, and secure multi-tenancy
                            into one platform — designed for scalability, security, and efficiency.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-gray-900/60">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-12">
                    Core Features
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {[
                        { icon: Shield, title: "Advanced Security", desc: "PBAC, IP restrictions, JWT, and audit logs." },
                        { icon: Users, title: "Multi-Tenant Support", desc: "Onboard multiple organizations securely." },
                        { icon: BarChart3, title: "AI Analytics", desc: "Estimate timelines, measure efficiency, and predict outcomes." },
                        { icon: Calendar, title: "Smart Calendar", desc: "Manage milestones with Google Calendar integration." },
                        { icon: Cpu, title: "High Scalability", desc: "Powered by React, Node.js, and MongoDB Atlas." },
                        { icon: Lock, title: "Role-Based Access", desc: "Fine-grained permissions for different roles." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800/80 p-6 rounded-xl shadow hover:shadow-yellow-400/40 transition"
                        >
                            <Icon className="text-yellow-400 w-10 h-10 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-gray-400">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Developer */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-12">Developer</h2>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/80 p-8 rounded-xl shadow-lg max-w-md mx-auto hover:shadow-yellow-400/40 transition"
                >
                    <img
                        src="https://vishalsharmadev.in/normalphotos/vishal.jpg"
                        alt="Vishal Sharma"
                        className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-yellow-400 object-cover"
                    />
                    <h3 className="text-2xl font-semibold mb-2">Vishal Sharma</h3>
                    <p className="text-gray-400 mb-4">
                        Full Stack Developer | Creator of NexoraSpace
                    </p>
                    <p className="text-gray-300 mb-6">📧 contact@vishalsharmadev.in</p>
                    <div className="flex justify-center gap-6 text-gray-400">
                        <a href="https://github.com/vishal-r-sharma" target="_blank" rel="noopener noreferrer">
                            <Github className="w-6 h-6 hover:text-yellow-400 transition" />
                        </a>
                        <a href="https://linkedin.com/in/vishal-r-sharma" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-6 h-6 hover:text-yellow-400 transition" />
                        </a>
                        <a href="mailto:contact@vishalsharmadev.in">
                            <Mail className="w-6 h-6 hover:text-yellow-400 transition" />
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
        </div>
    );
}
