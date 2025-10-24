// src/Routes/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "../components/SystemAdminDashboard";
import SystemAdminAddCompany from "../components/SystemAdminAddCompany";
import HomePage from "../components/HomePage";
import SystemAdminLogin from "../components/SystemAdminLogin";
import SystemAdminCompanyProfile from "../components/SystemaAdminCompanyProfile";
import CompanyLogin from "../components/Company/CompanyLogin";
import CompanyAdminDashboard from "../components/Company/CompanyAdmin/CompanyAdminDashboard";
import CompanyEmployeeManagement from "../components/Company/CompanyAdmin/CompanyEmployeeManagement";
import CompanyProjects from "../components/Company/CompanyAdmin/CompanyProjects";
import CompanyFinance from "../components/Company/CompanyAdmin/CompanyFinance";
import CompanySetting from "../components/Company/CompanyAdmin/CompanySetting";
import CompanyAI_General from "../components/Company/CompanyAdmin/CompanyAI_General";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/system/login" element={<SystemAdminLogin />} />
      <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
      <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
      <Route path="/system/company/:id" element={<SystemAdminCompanyProfile />} />
      <Route path="/company/login" element={<CompanyLogin />} />
      <Route path="/company/:role/dashboard/:userid/:companyid" element={<CompanyAdminDashboard/>} />
      <Route path="/company/:role/employee/:userid/:companyid" element={<CompanyEmployeeManagement/>}/>
      <Route path="/company/:role/projects/:userid/:companyid" element={<CompanyProjects />}/>
      <Route path="/company/:role/finance/:userid/:companyid" element={<CompanyFinance/>}/>
      <Route path="/company/:role/setting/:userid/:companyid" element={<CompanySetting />} />
      <Route path="/company/:role/AI/:userid/:companyid" element={<CompanyAI_General />} />
    </Routes>
  );
};

export default AppRoutes;