import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "./components/SystemAdminDashboard";
import SystemAdminAddCompany from "./components/SystemAdminAddCompany";
import HomePage from "./components/HomePage";
import SystemAdminLogin from "./components/SystemAdminLogin";
import SystemAdminCompanyProfile from "./components/SystemaAdminCompanyProfile";

const App = () => {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/system/login" element={<SystemAdminLogin />} />
        <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
        <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
        <Route path="/system/company-profile" element={<SystemAdminCompanyProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
