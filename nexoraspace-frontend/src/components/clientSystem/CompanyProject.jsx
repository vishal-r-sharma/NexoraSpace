import React, { useState } from "react";
import { Upload, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "./ProjectContext";
import { useEmployees } from "./EmployeeContext";

const CompanyProject = () => {
  const { projects, setProjects } = useProjects();
  const { employees } = useEmployees();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(null); // 'create' or 'edit'
  const [formData, setFormData] = useState({ documents: [], employees: [] });
  const [editProjectId, setEditProjectId] = useState(null);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleEmployeeToggle = (employee) => {
    const isSelected = formData.employees.some((e) => e.id === employee.id);
    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        employees: prev.employees.filter((e) => e.id !== employee.id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employees: [
          ...prev.employees,
          { ...employee, initial: employee.name.charAt(0) },
        ],
      }));
    }
  };

  const addDocumentField = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), { name: "", description: "", file: {} }],
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

  const openCreateModal = () => {
    setFormData({
      name: "",
      client: "",
      type: "Client",
      priority: "Medium",
      techStack: [],
      startDate: "",
      endDate: "",
      budget: 0,
      status: "In Progress",
      active: true,
      description: "",
      employees: [],
      documents: [],
    });
    setShowModal("create");
    setEditProjectId(null);
  };

  const openEditModal = (project) => {
    setFormData(project);
    setEditProjectId(project.id);
    setShowModal("edit");
  };

  const saveProject = () => {
    if (showModal === "create") {
      setProjects((prev) => [
        ...prev,
        { ...formData, id: Date.now(), manager: "Admin" },
      ]);
    } else if (showModal === "edit") {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editProjectId ? { ...formData, id: editProjectId } : p
        )
      );
    }
    setShowModal(null);
  };

  const deleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-600";
      case "Completed":
        return "bg-green-600";
      case "On Hold":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={openCreateModal}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-semibold flex items-center gap-2"
        >
          + Create Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{project.client}</p>
            <p className="text-gray-400 text-xs mb-3">
              {project.description.slice(0, 60)}...
            </p>
            <div className="text-sm text-gray-400 mb-3">
              <p>
                <Calendar className="inline w-4 h-4 mr-1" /> {project.startDate} —{" "}
                {project.endDate}
              </p>
              <p>Budget: ${project.budget.toLocaleString()}</p>
            </div>

            {/* Show employees initials */}
            <div className="flex -space-x-2 mb-4">
              {project.employees.map((emp) => (
                <div
                  key={emp.id}
                  className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-gray-900"
                >
                  {emp.initial}
                </div>
              ))}
            </div>

            <div className="mt-auto flex justify-between gap-2">
              <button
                onClick={() =>
                  navigate(`/company-admin/project/${project.id}`, {
                    state: { project },
                  })
                }
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs"
              >
                View
              </button>
              <button
                onClick={() => openEditModal(project)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showModal === "create" || showModal === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {showModal === "create" ? "Create Project" : "Edit Project"}
              </h2>
              <button onClick={() => setShowModal(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-gray-700 border p-2 rounded"
              />
              <input
                placeholder="Client Name"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                className="w-full bg-gray-700 border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full bg-gray-700 border p-2 rounded"
              />

              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full bg-gray-700 border p-2 rounded"
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full bg-gray-700 border p-2 rounded"
              />
              <input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  handleInputChange("budget", parseInt(e.target.value))
                }
                className="w-full bg-gray-700 border p-2 rounded"
                placeholder="Budget"
              />

              {/* Employees Assignment Section */}
              <h3 className="font-semibold">Assign Employees</h3>
              <div className="grid grid-cols-2 gap-2">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.employees.some((e) => e.id === employee.id)}
                      onChange={() => handleEmployeeToggle(employee)}
                      className="text-purple-600"
                    />
                    {employee.name} — {employee.role}
                  </label>
                ))}
              </div>

              {/* Documents Section */}
              <h3 className="font-semibold">Project Documents</h3>
              <button
                onClick={addDocumentField}
                className="bg-purple-600 px-3 py-1 rounded flex items-center gap-2 text-sm"
              >
                <Upload size={16} /> Add Document
              </button>
              {(formData.documents || []).map((doc, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 items-center mb-2">
                  <input
                    placeholder="Doc Name"
                    value={doc.name}
                    onChange={(e) => updateDocument(i, "name", e.target.value)}
                    className="bg-gray-700 border p-2 rounded"
                  />
                  <input
                    placeholder="Description"
                    value={doc.description}
                    onChange={(e) => updateDocument(i, "description", e.target.value)}
                    className="bg-gray-700 border p-2 rounded"
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
                    className="bg-gray-700 text-gray-300 border p-2 rounded"
                  />
                  <button
                    onClick={() => deleteDocument(i)}
                    className="bg-red-600 px-2 py-1 rounded text-white text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                className="bg-purple-600 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProject;
