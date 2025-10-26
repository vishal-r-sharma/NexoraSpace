// src/components/CompanyLayout.jsx
import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SideMenu from "../components/Company/CompanyAdmin/SideMenu";

const CompanyLayout = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasCheckedRef = useRef(false); // 🧠 Prevent duplicate checks

  useEffect(() => {
    const verifyToken = async () => {
      if (hasCheckedRef.current) return; // prevent re-runs
      hasCheckedRef.current = true;

      try {
        const res = await api.get("/api/auth/check", { withCredentials: true });
        if (res?.data?.authenticated) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.warn("❌ Invalid or expired company token");
        navigate("/company/login", { replace: true });
      } finally {
        setAuthChecked(true);
      }
    };

    verifyToken();
  }, [navigate]);

  // 🕓 While verifying token
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg text-gray-700 animate-pulse">
          Verifying company session...
        </div>
      </div>
    );
  }

  // 🚫 Not authenticated (redirect handled already)
  if (!isAuthenticated) return null;

  // ✅ Authenticated user layout (persistent sidebar)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideMenu />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyLayout;
