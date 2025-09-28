// src/components/clientSystem/EmployeeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem("employees");
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        name: "John Doe",
        email: "john@company.com",
        phone: "+1-555-0101",
        position: "Developer",
        department: "R&D",
        role: "Staff",
        employmentType: "Full-time",
        companyNumber: "1234567890",
        joinDate: "2024-01-15",
        dob: "1995-06-15",
        gender: "Male",
        maritalStatus: "Single",
        address: "123 Main Street, NY",
        emergencyContact: "Jane Doe (+1-555-0202)",
        salary: "$80,000",
        reportingManager: "Emily Davis",
        skills: ["React", "Node.js"],
        projects: ["Project A", "Project B"],
        documents: [
          { name: "ID Proof", description: "Govt ID", file: { name: "id.pdf", url: "" } },
          { name: "Offer Letter", description: "Signed contract", file: { name: "offer.pdf", url: "" } }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  return (
    <EmployeeContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeeContext);