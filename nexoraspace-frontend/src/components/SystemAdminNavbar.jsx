import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, LogOut } from "lucide-react"; // ✅ icons

const SystemAdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-gray-800 px-4 sm:px-6 py-3 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/system/dashboard")}
      >
        <img
          src="/logo-white.svg"
          alt="logo"
          className="h-12 md:h-14 w-auto"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-3 mt-3 sm:mt-0">
        <button
          onClick={() => navigate("/system/add-company")}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md bg-yellow-400 text-black text-sm font-semibold hover:scale-105 transition"
        >
          <PlusCircle size={18} /> {/* ✅ Add icon */}
          <span>Add Company</span>
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md bg-red-400 text-black text-sm font-semibold hover:scale-105 transition"
        >
          <LogOut size={18} /> {/* ✅ Logout icon */}
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
};

export default SystemAdminNavbar;
