import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEmployees } from "./EmployeeContext";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const { employees } = useEmployees();
  const navigate = useNavigate();

  const employee = employees.find(e => e.id === parseInt(id));

  if (!employee) return <div className="text-gray-400 p-6">Employee not found.</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <button onClick={() => navigate(-1)} 
        className="flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} className="mr-2"/> Back
      </button>

      <h1 className="text-3xl font-bold mb-6">{employee.name}</h1>

      {/* Personal & Employment */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Personal Info</h2>
          <p><b>Email:</b> {employee.email}</p>
          <p><b>Phone:</b> {employee.phone}</p>
          <p><b>DOB:</b> {employee.dob}</p>
          <p><b>Address:</b> {employee.address}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Employment Info</h2>
          <p><b>Department:</b> {employee.department}</p>
          <p><b>Position:</b> {employee.position}</p>
          <p><b>Role:</b> {employee.role}</p>
          <p><b>Employment Type:</b> {employee.employmentType}</p>
          <p><b>Salary:</b> {employee.salary}</p>
          <p><b>Manager:</b> {employee.reportingManager}</p>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mt-6">
        <h2 className="font-semibold mb-2">Projects</h2>
        {employee.projects?.length ? (
          <ul className="list-disc list-inside">{employee.projects.map((p,i)=><li key={i}>{p}</li>)}</ul>
        ) : <p className="text-gray-400">No projects assigned.</p>}
      </div>

      {/* Documents */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mt-6">
        <h2 className="font-semibold mb-2">Documents</h2>
        {employee.documents?.length ? (
          employee.documents.map((doc,i)=>(
            <div key={i} className="flex justify-between items-center border-b border-gray-600 py-2">
              <div>
                <b>{doc.name}</b>
                <p className="text-sm text-gray-400">{doc.description}</p>
              </div>
              {doc.file?.url ? (
                <a href={doc.file.url} target="_blank" rel="noopener noreferrer"
                   className="text-blue-400 hover:text-blue-300 underline">View</a>
              ) : (
                <span className="text-gray-400">{doc.file?.name || "No file"}</span>
              )}
            </div>
          ))
        ) : <p className="text-gray-400">No documents uploaded.</p>}
      </div>
    </div>
  );
};

export default EmployeeDetailPage;