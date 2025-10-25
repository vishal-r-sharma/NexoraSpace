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
  MessageCircle,
  User,
  BotMessageSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/axios";

function SideMenu() {
  const [open, setOpen] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const role = pathParts[2];
  const userId = pathParts[4];
  const companyId = pathParts[5];

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

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/auth/logout", {}, { withCredentials: true });
      if (res.data?.success) {
        window.location.href = "/company/login";
      } else {
        window.location.href = "/company/login";
      }
    } catch {
      window.location.href = "/company/login";
    }
  };

  const handleClosePopup = () => {
    setShowSupportForm(false);
  };

  const menuItems = useMemo(() => {
    const base = `/company/${role}/dashboard/${userId}/${companyId}`;
    return [
      { icon: <Home />, label: "Dashboard", path: base },
      { icon: <Users />, label: "Employees", path: `/company/${role}/employee/${userId}/${companyId}` },
      { icon: <Briefcase />, label: "Projects", path: `/company/${role}/projects/${userId}/${companyId}` },
      { icon: <DollarSign />, label: "Finance", path: `/company/${role}/finance/${userId}/${companyId}` },
      { icon: <BotMessageSquare />, label: "AI", path: `/company/${role}/AI/${userId}/${companyId}` },
      { icon: <Settings />, label: "Settings", path: `/company/${role}/setting/${userId}/${companyId}` },
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
        className={`fixed md:sticky top-0 left-0 w-64 bg-gradient-to-b from-[#0d1321] via-[#1b263b] to-[#1b263b] text-white transform transition-transform duration-300 z-50 flex flex-col justify-between shadow-2xl min-h-screen ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center mt-6 overflow-y-auto flex-grow">
          <div className="text-center mb-4">
            <img
              src={company?.logoUrl || "https://nexoraspace.vishalsharmadev.in/logo-white.svg"}
              alt={company?.companyName ? `${company.companyName} Logo` : "Company Logo"}
              className="h-20 mx-auto mb-2 drop-shadow-lg"
            />
            <h2 className="text-lg font-semibold tracking-wide text-gray-300 pb-4">
              {loading ? "Loading..." : company?.companyName || "—"}
            </h2>

            {/* User Info */}
            <div className="flex items-center justify-center bg-[#1b263b]/60 border border-[#2c3e50] rounded-xl p-3 w-52 mx-auto shadow-inner hover:shadow-[#6fb1fc]/20 transition-all duration-300">
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-[#6fb1fc] p-2.5 rounded-full shadow-sm">
                    <User className="text-[#0d1321]" size={18} />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="font-semibold text-m text-white truncate max-w-[110px]">
                      {user.role}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[110px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">User not found</p>
              )}
            </div>

            {errMsg && <p className="text-xs text-red-400 mt-2">{errMsg}</p>}
          </div>

          {/* Navigation */}
          <ul className="w-full space-y-2 px-4 mt-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  location.pathname === item.path
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
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div onClick={item.action} className="flex items-center space-x-3 w-full">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
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

      {/* ✅ Simplified Contact Support Popup */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1321] text-white rounded-2xl shadow-2xl w-96 p-6 relative border border-[#1b263b] animate-fadeIn">
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Contact Support</h2>

            <p className="text-gray-300 text-center leading-relaxed">
              For any help, questions, or support, please reach out at:
            </p>

            <div className="text-center mt-4">
              <a
                href="mailto:contact@vishalsharmadev.in"
                className="text-[#6fb1fc] font-semibold underline text-lg block"
              >
                contact@vishalsharmadev.in
              </a>
              <a
                href="https://vishalsharmadev.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 text-sm mt-2 inline-block hover:text-[#8ecdfc]"
              >
                https://vishalsharmadev.in
              </a>
            </div>

            <p className="text-sm text-gray-400 text-center mt-5">
              Our team will get back to you as soon as possible 🚀
            </p>
          </div>
        </div>
      )}

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
