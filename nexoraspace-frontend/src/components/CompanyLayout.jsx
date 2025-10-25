// src/components/Company/CompanyLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/Company/CompanyAdmin/SideMenu";

const CompanyLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (persistent) */}
      <SideMenu />

      {/* Main content (changes when route changes) */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyLayout;
