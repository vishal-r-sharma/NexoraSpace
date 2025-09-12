// src/Routes/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "../components/SystemAdminDashboard";
import SystemAdminAddCompany from "../components/SystemAdminAddCompany";
import HomePage from "../components/HomePage";
import SystemAdminLogin from "../components/SystemAdminLogin";
import SystemAdminCompanyProfile from "../components/SystemaAdminCompanyProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/system/login" element={<SystemAdminLogin />} />
      <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
      <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
      <Route path="/system/company/:id" element={<SystemAdminCompanyProfile />} />
    </Routes>
  );
};

export default AppRoutes;