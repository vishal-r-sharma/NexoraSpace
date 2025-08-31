import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SystemAdminDashboard from "./components/SystemAdminDashboard";
import SystemAdminAddCompany from "./components/SystemAdminAddCompany";

const App = () => {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<SystemAdminDashboard />} />
        <Route path="/add-company" element={<SystemAdminAddCompany />} />
      </Routes>
    </Router>
  );
};

export default App;
