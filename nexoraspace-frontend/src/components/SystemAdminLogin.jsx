import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function SystemAdminLogin() {
    const navigate = useNavigate();


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
                {/* <form className="space-y-5"> */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        // type="submit"
                        onClick={() => navigate("/system/dashboard")}

                        className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold text-lg hover:bg-yellow-400 transition shadow-lg"
                    >
                        Login
                    </motion.button>
                {/* </form> */}
            </motion.div>
        </div>
    );
}
