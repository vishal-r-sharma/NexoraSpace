import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();

  // Active link check
  const isActive = (path) => location.pathname.startsWith(path);

  // Classes for nav links
  const navClasses = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200
     ${isActive(path)
       ? "bg-purple-700 text-white"
       : "hover:bg-gray-800 hover:text-white"}`;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72
          bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 p-6 
          border-r border-gray-700 transform transition-transform duration-300 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-8 mt-12 lg:mt-0 border-b border-gray-700 pb-4">
          <img
            src="https://via.placeholder.com/48"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-purple-600 shadow-md"
          />
          <div>
            <h1 className="text-lg font-semibold text-white">John Smith</h1>
            <span className="text-xs text-purple-400">Company Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1">
          <Link to="/companyadmin" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin")}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/companyadmin/employee" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin/employee")}>
            <Users className="w-5 h-5" />
            Employees
          </Link>
          <Link to="/companyadmin/project" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin/project")}>
            <FolderKanban className="w-5 h-5" />
            Projects
          </Link>
          <Link to="/companyadmin/billing" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin/billing")}>
            <CreditCard className="w-5 h-5" />
            Billing System
          </Link>
          <Link to="/companyadmin/reports" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin/reports")}>
            <BarChart2 className="w-5 h-5" />
            Report Problem {/* ✅ fixed name */}
          </Link>
          <Link to="/companyadmin/settings" onClick={() => setIsOpen(false)} className={navClasses("/companyadmin/settings")}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
            <LifeBuoy className="w-5 h-5" />
            Contact Support
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;