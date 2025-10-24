import React, { useState, useEffect, useMemo } from "react";
import {
  Menu,
  X,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  LogOut,
  Home,
  Bell,
  MessageCircle,
  User,
  BotMessageSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/axios";

function SideMenu() {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const location = useLocation();

  // 🧭 Extract params from path like /company/admin/dashboard/:userId/:companyId
  const pathParts = location.pathname.split("/");
  const role = pathParts[2];
  const userId = pathParts[4];
  const companyId = pathParts[5];

  // 🔍 Fetch user + company info
  useEffect(() => {
    let cancelled = false;

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        if (!userId || !companyId) {
          setErrMsg("Missing user or company ID in URL.");
          setLoading(false);
          return;
        }

        const res = await api.get(`/api/company/data/user/${userId}/${companyId}`, {
          withCredentials: true,
        });

        if (!cancelled) {
          if (res.data?.success) {
            setUser(res.data.user);
            setCompany(res.data.company);
          } else {
            setErrMsg(res.data?.message || "Failed to load user info");
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ Fetch error:", err.response?.data || err.message);
          setErrMsg(err.response?.data?.message || "Error fetching user info");
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
    return () => {
      cancelled = true;
    };
  }, [userId, companyId]);

  // 🔐 Logout handler
  const handleLogout = async () => {
    try {
      const res = await api.post("/api/auth/logout", {}, { withCredentials: true });
      if (res.data?.success) {
        console.log("✅ Logout successful:", res.data.message);
        window.location.href = "/company/login";
      } else {
        console.error("❌ Logout failed:", res.data);
        window.location.href = "/company/login";
      }
    } catch (err) {
      console.error("❌ Logout error:", err.response?.data || err.message);
      window.location.href = "/company/login";
    }
  };

  const handleClosePopup = () => {
    setShowNotifications(false);
    setShowSupportForm(false);
  };

  // 🧭 Build menu dynamically based on role & IDs
  const menuItems = useMemo(() => {
    const base = `/company/${role}/dashboard/${userId}/${companyId}`;
    return [
      { icon: <Home />, label: "Dashboard", path: base },
      { icon: <Users />, label: "Employees", path: `/company/${role}/employee/${userId}/${companyId}` },
      { icon: <Briefcase />, label: "Projects", path: `/company/${role}/projects/${userId}/${companyId}` },
      { icon: <DollarSign />, label: "Finance", path: `/company/${role}/finance/${userId}/${companyId}` },
      { icon: <BotMessageSquare />, label: "AI", path: `/company/${role}/AI/${userId}/${companyId}` },
      { icon: <Settings />, label: "Settings", path: `/company/${role}/setting/${userId}/${companyId}` },
      { icon: <Bell />, label: "Notifications", action: () => setShowNotifications(true) },
      { icon: <MessageCircle />, label: "Contact Support", action: () => setShowSupportForm(true) },
    ];
  }, [role, userId, companyId]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-[#0d1321] text-white p-4 fixed top-0 left-0 w-full z-40 shadow-lg">
        <img
          src={company?.logoUrl || "https://nexoraspace.vishalsharmadev.in/logo-white.svg"}
          alt="Company Logo"
          className="h-8"
        />
        <button onClick={() => setOpen(!open)} className="focus:outline-none text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 w-64 bg-gradient-to-b from-[#0d1321] via-[#1b263b] to-[#1b263b] text-white transform transition-transform duration-300 z-50 flex flex-col justify-between shadow-2xl min-h-screen ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center mt-6 overflow-y-auto flex-grow">
          <div className="text-center mb-4">
            <img
              src={company?.logoUrl || "https://nexoraspace.vishalsharmadev.in/logo-white.svg"}
              alt={company?.companyName ? `${company.companyName} Logo` : "Company Logo"}
              className="h-20 mx-auto mb-2 drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://nexoraspace.vishalsharmadev.in/logo-white.svg";
              }}
            />

            <h2 className="text-lg font-semibold tracking-wide text-gray-300 pb-4">
              {loading ? "Loading..." : company?.companyName || "—"}
            </h2>

            {/* 🧑 Dynamic User Info */}
            <div className="flex items-center justify-center bg-[#1b263b]/60 border border-[#2c3e50] rounded-xl p-3 w-52 mx-auto shadow-inner hover:shadow-[#6fb1fc]/20 transition-all duration-300">
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="bg-[#6fb1fc] p-2.5 rounded-full flex items-center justify-center shadow-sm">
                      <User className="text-[#0d1321]" size={18} />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${user.isActive ? "bg-green-400" : "bg-gray-400"
                        } border-2 border-[#1b263b] rounded-full`}
                    ></div>
                  </div>
                  <div className="text-left leading-tight">
                    <p className="font-semibold text-m text-white truncate max-w-[110px]">
                      {user.role}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[110px]">
                      {user.email}
                    </p>
                    <p className="text-[10px] text-gray-500 italic">{user.role}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">User not found</p>
              )}
            </div>

            {/* Error Message */}
            {errMsg && <p className="text-xs text-red-400 mt-2">{errMsg}</p>}
          </div>

          {/* Navigation */}
          <ul className="w-full space-y-2 px-4 mt-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${location.pathname === item.path
                    ? "bg-[#1d3557] text-white shadow-md"
                    : "hover:bg-[#1e2a3a] text-gray-300 hover:text-white"
                  }`}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 w-full"
                    onClick={() => setOpen(false)}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div
                    onClick={item.action}
                    className="flex items-center space-x-3 w-full"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                )}
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#6fb1fc] rounded-r-lg"></div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="p-6 border-t border-[#1b263b] bg-[#0d1321]/80 backdrop-blur-md mt-auto sticky bottom-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-400 hover:text-red-500 transition-colors duration-200 w-full"
          >
            <LogOut />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Notifications Popup */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1321] text-white rounded-2xl shadow-2xl w-96 p-6 relative border border-[#1b263b] animate-fadeIn">
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <ul className="space-y-3 text-gray-200">
              <li className="bg-[#1b263b] p-3 rounded-lg border border-gray-700">
                New project assigned to Team A
              </li>
              <li className="bg-[#1b263b] p-3 rounded-lg border border-gray-700">
                Monthly report is ready for review
              </li>
              <li className="bg-[#1b263b] p-3 rounded-lg border border-gray-700">
                System maintenance scheduled for tomorrow
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Contact Support Popup */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1321] text-white rounded-2xl shadow-2xl w-96 p-6 relative border border-[#1b263b] animate-fadeIn">
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#1b263b] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6fb1fc] outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#1b263b] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6fb1fc] outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Issue / Message
                </label>
                <textarea
                  className="w-full bg-[#1b263b] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6fb1fc] outline-none"
                  rows="3"
                  placeholder="Describe your issue..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6fb1fc] text-[#0d1321] py-2 rounded-lg font-semibold hover:bg-[#8ecdfc] transition-all"
              >
                Send Message
              </button>
            </form>
            <p className="text-sm text-center text-gray-400 mt-4">
              Or email us directly at{" "}
              <a
                href="mailto:contact@vishalsharmadev.in"
                className="text-[#6fb1fc] font-medium"
              >
                contact@vishalsharmadev.in
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Overlay for Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SideMenu;
