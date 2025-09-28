// src/Routes/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "../components/SystemAdminDashboard";
import SystemAdminAddCompany from "../components/SystemAdminAddCompany";
import HomePage from "../components/HomePage";
import SystemAdminLogin from "../components/SystemAdminLogin";
import SystemAdminCompanyProfile from "../components/SystemaAdminCompanyProfile";
import Mainpage from "../components/clientSystem/Mainpage";
import EmployeePage from "../components/clientSystem/EmployeePage";
import Companyprojectpage from "../components/clientSystem/CompanyProjectPage ";
import CompanyProjectPage from "../components/clientSystem/CompanyProjectPage ";
import CompanyBillingPage from "../components/clientSystem/CompanyBillingPage";
import CompanySettingPage from "../components/clientSystem/CompanySettingPage";
import CompanyReportPage from "../components/clientSystem/CompanyReportPage";
import EmployeeDetailPage from "../components/clientSystem/EmployeeDetailPage";
import ProjectDetailPage from "../components/clientSystem/ProjectDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/system/login" element={<SystemAdminLogin />} />
      <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
      <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
      <Route path="/system/company/:id" element={<SystemAdminCompanyProfile />} />
      <Route path="/companyadmin" element={<Mainpage />} />
      <Route path="/companyadmin/employee" element={<EmployeePage />} />
      <Route path="/companyadmin/project" element={<CompanyProjectPage />} />
      <Route path="/companyadmin/billing" element={<CompanyBillingPage />} />
      <Route path="/companyadmin/settings" element={<CompanySettingPage />} />
      <Route path="/companyadmin/reports" element={<CompanyReportPage />} />
      <Route path="/company-admin/employee/:id" element={<EmployeeDetailPage />} />
      <Route path="/company-admin/project/:id" element={<ProjectDetailPage />} />
      
    </Routes>
  );
};

export default AppRoutes;