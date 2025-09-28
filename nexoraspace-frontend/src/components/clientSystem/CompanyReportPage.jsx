import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust path as needed
import CompanyReport from "./CompanyReport";

const CompanyReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative bg-gray-900 w-64 h-full shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile Header with Toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h1 className="text-xl font-semibold text-white">Company Reports</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <CompanyReport />
      </div>
    </div>
  );
};

export default CompanyReportPage;