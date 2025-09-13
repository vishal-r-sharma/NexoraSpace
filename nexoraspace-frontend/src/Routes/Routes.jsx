// src/Routes/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "../components/SystemAdminDashboard";
import SystemAdminAddCompany from "../components/SystemAdminAddCompany";
import HomePage from "../components/HomePage";
import SystemAdminLogin from "../components/SystemAdminLogin";
import SystemAdminCompanyProfile from "../components/SystemaAdminCompanyProfile";
import CompanyLogin from "../components/Company/CompanyLogin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/system/login" element={<SystemAdminLogin />} />
      <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
      <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
      <Route path="/system/company/:id" element={<SystemAdminCompanyProfile />} />
      <Route path="/company/login" element={<CompanyLogin />} />
    </Routes>
  );
};

export default AppRoutes;