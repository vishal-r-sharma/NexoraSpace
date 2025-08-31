import React from "react";
import { useNavigate } from "react-router-dom";

const SystemAdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex flex-wrap justify-between items-center bg-gray-800 px-4 sm:px-6 py-2 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo-white.svg"
          alt="logo"
          className="h-10 sm:h-13 md:h-13 w-auto"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
        <button
          onClick={() => navigate("/add-company")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-yellow-400 text-black text-xs sm:text-sm font-medium hover:scale-105 transition"
        >
          Add Company
        </button>

        <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-yellow-400 text-black text-xs sm:text-sm font-medium hover:scale-105 transition">
          LogOut
        </button>
      </div>
    </header>
  );
};

export default SystemAdminNavbar;
