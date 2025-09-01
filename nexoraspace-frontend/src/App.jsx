import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "./components/SystemAdminDashboard";
import SystemAdminAddCompany from "./components/SystemAdminAddCompany";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/system/dashboard" element={<SystemAdminDashboard />} />
        <Route path="/system/add-company" element={<SystemAdminAddCompany />} />
      </Routes>
    </Router>
  );
};

export default App;
