// src/components/clientSystem/EmployeeManagement.jsx
import React, { useState } from "react";
import { Eye, Edit, Trash2, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";

const EmployeeManagement = () => {
  const { employees, setEmployees } = useEmployees();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ documents: [] });

  const departments = [
    "R&D",
    "UX",
    "Testing",
    "Operations",
    "Marketing",
    "Sales",
    "Finance",
    "HR",
    "DevOps",
    "Product",
  ];
  const roles = [
    "Intern",
    "Staff",
    "Manager",
    "Sr. Manager",
    "Lead",
    "HR",
    "Finance",
    "Designer",
    "Product Manager",
  ];
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addDocumentField = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...(prev.documents || []),
        { name: "", description: "", file: {} },
      ],
    }));
  };

  const updateDocument = (i, field, value) => {
    const docs = [...formData.documents];
    docs[i][field] = value;
    setFormData((prev) => ({ ...prev, documents: docs }));
  };

  const deleteDocument = (i) => {
    const docs = [...formData.documents];
    docs.splice(i, 1);
    setFormData((prev) => ({ ...prev, documents: docs }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.position || !formData.department) {
      alert("Fill all mandatory fields: Name, Email, Position, Department");
      return;
    }

    if (editMode) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === formData.id ? formData : e))
      );
    } else {
      setEmployees((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDeleteEmployee = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <button
          onClick={() => {
            setFormData({ documents: [] });
            setEditMode(false);
            setShowModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded text-black font-semibold"
        >
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 shadow rounded">
        <table className="w-full text-sm border border-gray-700">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-700">
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.department}</td>
                <td className="p-2 border">{emp.role}</td>
                <td className="p-2 border">{emp.email}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/company-admin/employee/${emp.id}`)
                    }
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setFormData(emp);
                      setEditMode(true);
                      setShowModal(true);
                    }}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editMode ? "Edit Employee" : "Add Employee"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            {/* Employee Fields */}
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Full Name*"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Email*"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="DOB"
                value={formData.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Position*"
                value={formData.position || ""}
                onChange={(e) => handleChange("position", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Company Number"
                value={formData.companyNumber || ""}
                onChange={(e) => handleChange("companyNumber", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Salary"
                value={formData.salary || ""}
                onChange={(e) => handleChange("salary", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Reporting Manager"
                value={formData.reportingManager || ""}
                onChange={(e) => handleChange("reportingManager", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <select
                value={formData.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              >
                <option value="">Select Department*</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select
                value={formData.role || ""}
                onChange={(e) => handleChange("role", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              >
                <option value="">Select Role*</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <select
                value={formData.employmentType || ""}
                onChange={(e) => handleChange("employmentType", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              >
                {employmentTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                type="date"
                placeholder="Join Date"
                value={formData.joinDate || ""}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                className="bg-gray-700 border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="col-span-2 bg-gray-700 border px-3 py-2 rounded"
              />
              <input
                placeholder="Emergency Contact"
                value={formData.emergencyContact || ""}
                onChange={(e) =>
                  handleChange("emergencyContact", e.target.value)
                }
                className="col-span-2 bg-gray-700 border px-3 py-2 rounded"
              />
            </div>

            {/* Document Fields */}
            <div className="mt-4">
              <h3 className="font-bold text-lg mb-2">Documents</h3>
              <button
                onClick={addDocumentField}
                className="bg-purple-600 px-3 py-1 mb-3 rounded flex items-center gap-2 hover:bg-purple-700"
              >
                <Upload size={16} /> Add Document
              </button>

              {(formData.documents || []).map((doc, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2 items-center">
                  <input
                    placeholder="Doc Name"
                    value={doc.name}
                    onChange={(e) =>
                      updateDocument(i, "name", e.target.value)
                    }
                    className="bg-gray-700 border border-gray-600 px-2 py-1 rounded"
                  />
                  <input
                    placeholder="Description"
                    value={doc.description}
                    onChange={(e) =>
                      updateDocument(i, "description", e.target.value)
                    }
                    className="bg-gray-700 border border-gray-600 px-2 py-1 rounded"
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        updateDocument(i, "file", {
                          name: file.name,
                          url: URL.createObjectURL(file),
                        });
                      }
                    }}
                    className="bg-gray-700 text-gray-400 border border-gray-600 px-2 py-1 rounded"
                  />

                  {/* Delete button */}
                  <button
                    onClick={() => deleteDocument(i)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded"
              >
                {editMode ? "Save" : "Add"} Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;