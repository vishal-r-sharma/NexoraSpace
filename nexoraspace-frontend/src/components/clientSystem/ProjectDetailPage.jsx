import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const project = state?.project; // passed from navigate()

  if (!project) {
    return (
      <div className="bg-gray-900 text-white p-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 mb-4">
          <ArrowLeft className="inline mr-2" /> Back
        </button>
        <h2 className="text-xl">Project not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <button onClick={() => navigate(-1)} className="text-gray-400 mb-4 flex items-center gap-2">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded p-4">
          <h2 className="font-semibold mb-2">General Info</h2>
          <p><b>Client:</b> {project.client}</p>
          <p><b>Type:</b> {project.type}</p>
          <p><b>Priority:</b> {project.priority}</p>
          <p><b>Manager:</b> {project.manager}</p>
          <p><b>Budget:</b> ${project.budget.toLocaleString()}</p>
          <p><b>Status:</b> {project.status}</p>
          <p><b>Active:</b> {project.active ? "Yes" : "No"}</p>
          <p><b>Start:</b> {project.startDate}</p>
          <p><b>End:</b> {project.endDate}</p>
        </div>

        <div className="bg-gray-800 rounded p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p>{project.description}</p>
        </div>
      </div>

      {/* Employees */}
      <div className="bg-gray-800 rounded p-4 mt-6">
        <h2 className="font-semibold mb-2">Employees</h2>
        {project.employees.map(emp => (
          <div key={emp.id} className="border-b border-gray-700 py-2">
            <b>{emp.name}</b> — {emp.role}
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="bg-gray-800 rounded p-4 mt-6">
        <h2 className="font-semibold mb-2">Documents</h2>
        {project.documents?.length ? (
          project.documents.map((doc, i) => (
            <div key={i} className="flex justify-between border-b border-gray-700 py-2">
              <div>
                <b>{doc.name}</b>
                <p className="text-sm text-gray-400">{doc.description}</p>
              </div>
              {doc.file?.url ? (
                <a href={doc.file.url} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                  View
                </a>
              ) : (
                <span className="text-gray-500">{doc.file?.name || "No file"}</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No documents uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;