import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  BrainCircuit,
  X,
  FolderGit2,
  Save,
  Calendar,
  DollarSign,
  Building2,
  User,
  FileText,
  Layers,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import api from "../../../api/axios";

const BACKEND_BASE_URL = "https://api.nexoraspace.vishalsharmadev.in";

/* ----------------- MODERN MODAL ----------------- */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div onClick={onClose} className="absolute inset-0 cursor-pointer" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#0d1321] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-[fadeIn_0.3s_ease-out]"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-xl font-semibold tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------- PROJECT CARD ----------------- */
function ProjectCard({ project, onView, onEdit, onDelete, onAI }) {
  const statusColors = {
    Active: "bg-green-100 text-green-700",
    Planning: "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    OnHold: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {project.name}
          </h2>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[project.status] || "bg-gray-100 text-gray-700"
              }`}
          >
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">
          <p className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 text-gray-500" /> {project.client}
          </p>
          <p className="flex items-center gap-2 truncate">
            <User className="h-4 w-4 text-gray-500" /> {project.manager}
          </p>
          <p className="flex items-center gap-2 truncate">
            <DollarSign className="h-4 w-4 text-gray-500" /> {project.budget}
          </p>
          <p className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 text-gray-500" />
            {project.startDate?.slice(0, 10)} → {project.endDate?.slice(0, 10)}
          </p>
          <p className="flex items-center gap-2 truncate">
            <Layers className="h-4 w-4 text-gray-500" />{" "}
            {project.technology || "—"}
          </p>
          <p className="flex items-center gap-2 truncate">
            <Users className="h-4 w-4 text-gray-500" />{" "}
            {project.team?.join(", ") || "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 flex items-center">
          <FileText className="h-4 w-4 mr-1" />
          {project.documents?.length || 0} documents
        </p>
        <div className="flex gap-3">
          <button onClick={onView} className="text-blue-600 hover:text-blue-800">
            <Eye className="h-5 w-5" />
          </button>
          <button onClick={onEdit} className="text-green-600 hover:text-green-800">
            <Edit className="h-5 w-5" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <Trash2 className="h-5 w-5" />
          </button>
          <button onClick={onAI} className="text-indigo-600 hover:text-indigo-800">
            <BrainCircuit className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- MAIN COMPONENT ----------------- */
function CompanyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, type: "" });
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Planning",
    budget: "",
    startDate: "",
    endDate: "",
    manager: "",
    description: "",
    technology: "",
    team: [],
    documents: [],
  });

  const allStatuses = ["All", "Planning", "Active", "Completed", "OnHold"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 projects per page



  // ✅ Form validation helper
  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.client.trim() &&
      form.manager.trim() &&
      form.technology.trim() &&
      form.team.length > 0 &&
      form.budget.trim() &&
      form.startDate &&
      form.endDate &&
      form.status.trim() &&
      form.description.trim()
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);


  /* ----------------- LOAD PROJECTS ----------------- */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/company/data/projects");
      if (res.data.success) setProjects(res.data.projects);
    } catch (err) {
      console.error("❌ Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };


  const openModal = (type, proj = null) => {
    setSelected(proj);
    setModal({ open: true, type });
    if (proj) setForm(proj);
    else
      setForm({
        name: "",
        client: "",
        status: "Planning",
        budget: "",
        startDate: "",
        endDate: "",
        manager: "",
        description: "",
        technology: "",
        team: [],
        documents: [],
      });
  };

  const closeModal = () => setModal({ open: false, type: "" });

  /* ----------------- SAVE PROJECT ----------------- */
  const saveProject = async () => {
    try {
      if (!isFormValid()) {
        alert("⚠️ Please fill all required fields before saving.");
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("client", form.client);
      formData.append("manager", form.manager);
      formData.append("status", form.status);
      formData.append("budget", form.budget);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("description", form.description);
      formData.append("technology", form.technology);
      formData.append("team", form.team.join(","));

      if (form.documents?.length > 0) {
        form.documents.forEach((file) => {
          if (file instanceof File) formData.append("documents", file);
        });
      }

      if (modal.type === "add") {
        await api.post("/api/company/data/projects/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/api/company/data/projects/${selected._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error("❌ Save project error:", err);
      alert("Failed to save project.");
    }
  };




  /* ----------------- DELETE PROJECT ----------------- */
  const deleteProject = async () => {
    try {
      await api.delete(`/api/company/data/projects/${selected._id}`);
      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error("❌ Delete project error:", err);
      alert("Failed to delete project.");
    }
  };

  // Delete a single document from project
  const deleteDocumentFromServer = async (projectId, docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      console.log("🟡 Deleting Document:", projectId, docId);
      const res = await api.delete(`/api/company/data/projects/${projectId}/document/${docId}`, {
        withCredentials: true,
      });

      console.log("🟢 DELETE RESPONSE:", res.data);
      if (res.data.success) {
        alert("✅ Document deleted successfully!");
        await fetchProjects();
      } else {
        alert("⚠️ Failed to delete document.");
      }
    } catch (err) {
      console.error("❌ Document delete error:", err.response?.data || err.message);
      alert("Failed to delete document.");
    }
  };



  /* ----------------- DOCUMENT UPLOAD ----------------- */
  /* ----------------- DOCUMENT UPLOAD ----------------- */
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), ...files],
    }));
  };




  const deleteDocument = (index) => {
    const updatedDocs = form.documents.filter((_, i) => i !== index);
    setForm({ ...form, documents: updatedDocs });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = projects.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (
      search &&
      !`${p.name} ${p.client}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filtered.slice(startIndex, startIndex + itemsPerPage);


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <h1 className="text-2xl pb-4 font-bold text-gray-800 flex items-center">
          <FolderGit2 className="mr-2 text-blue-600" /> Projects Management
        </h1>

        {/* Header + Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-white shadow p-4 rounded-2xl">
          <div className="flex items-center flex-1 min-w-[200px] bg-gray-50 border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            {allStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading Projects...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProjects.map((proj) => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onView={() => openModal("view", proj)}
                onEdit={() => openModal("edit", proj)}
                onDelete={() => openModal("delete", proj)}
                onAI={() => alert("AI Workspace coming soon 🚀")}
              />
            ))}
          </div>
        )}

        {/* ---------------- ADD / EDIT MODAL ---------------- */}
        <Modal
          open={modal.open && (modal.type === "add" || modal.type === "edit")}
          title={modal.type === "add" ? "Add New Project" : "Edit Project"}
          onClose={closeModal}
          footer={
            <>
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                disabled={!isFormValid()}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed opacity-60"
                  }`}
              >
                <Save className="w-4 h-4" /> Save
              </button>

            </>
          }
        >
          {/* FORM */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Project Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="text"
              required
              placeholder="Client *"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="text"
              required
              placeholder="Manager *"
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="text"
              required
              placeholder="Technology Stack *"
              value={form.technology}
              onChange={(e) =>
                setForm({ ...form, technology: e.target.value })
              }
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="text"
              required
              placeholder="Team Members (comma separated) *"
              value={form.team.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  team: e.target.value.split(",").map((x) => x.trim()),
                })
              }
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="text"
              required
              placeholder="Budget *"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            />
            <input
              type="date"
              required
              value={form.startDate?.slice(0, 10)}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white"
            />
            <input
              type="date"
              required
              value={form.endDate?.slice(0, 10)}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white"
            />
            <select
              value={form.status}
              required
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white col-span-2"
            >
              {["Planning", "Active", "Completed", "OnHold"].map((s) => (
                <option key={s} className="bg-[#0d1321]">
                  {s}
                </option>
              ))}
            </select>
            <textarea
              rows="3"
              required
              placeholder="Project Description *"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="col-span-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
            ></textarea>

            {/* Document Upload */}
            <div className="col-span-2">
              <label className="block text-sm mb-2 text-white/80">
                Upload Documents
              </label>
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-none file:bg-blue-600 file:text-white file:px-3 file:py-1.5 hover:file:bg-blue-700"
              />
              {form.documents.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm">
                  {form.documents.length > 0 && (
                    <ul className="mt-3 space-y-2 text-sm">
                      {form.documents.length > 0 && (
                        <ul className="mt-3 space-y-2 text-sm">
                          {form.documents.map((doc, i) => {
                            const fileName =
                              doc?.name ||
                              (doc instanceof File
                                ? doc.name
                                : typeof doc === "string"
                                  ? doc
                                  : "Unknown file");

                            return (
                              <li
                                key={i}
                                className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2"
                              >
                                <span className="truncate">{fileName}</span>
                                <button
                                  onClick={() => deleteDocument(i)}
                                  className="text-red-400 hover:text-red-600 text-xs"
                                >
                                  Delete
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                    </ul>
                  )}


                </ul>
              )}
            </div>
          </div>
        </Modal>

        {/* ---------------- VIEW MODAL ---------------- */}
        <Modal
          open={modal.open && modal.type === "view"}
          title="Project Overview"
          onClose={closeModal}
          footer={
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
            >
              Close
            </button>
          }
        >
          {selected && (
            <div className="space-y-4 text-white/90">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h2 className="text-2xl font-bold tracking-wide">
                  {selected.name}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${selected.status === "Active"
                    ? "bg-green-500/20 text-green-300"
                    : selected.status === "Planning"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : selected.status === "Completed"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                >
                  {selected.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm leading-relaxed">
                {selected.description || "No description provided."}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <p>
                  <strong className="text-white/80">Client:</strong> {selected.client}
                </p>
                <p>
                  <strong className="text-white/80">Manager:</strong> {selected.manager}
                </p>
                <p>
                  <strong className="text-white/80">Budget:</strong> {selected.budget}
                </p>
                <p>
                  <strong className="text-white/80">Technology:</strong> {selected.technology}
                </p>
                <p>
                  <strong className="text-white/80">Timeline:</strong>{" "}
                  {selected.startDate?.slice(0, 10)} → {selected.endDate?.slice(0, 10)}
                </p>
                <p>
                  <strong className="text-white/80">Team Members:</strong>{" "}
                  {selected.team?.length > 0 ? selected.team.join(", ") : "—"}
                </p>
              </div>

              {/* Documents Section */}
              {selected.documents?.length > 0 ? (
                <div className="mt-4">
                  <strong className="block text-white/80 mb-2">Documents:</strong>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selected.documents.map((doc, i) => {
                      const isObj = typeof doc === "object" && doc !== null;
                      const fileName = isObj ? doc.name : doc;
                      // ✅ Use full backend URL for document access
                      const fileUrl = isObj
                        ? `${BACKEND_BASE_URL}${doc.fileUrl?.replace(/.*uploads/, "/uploads").replace(/\\/g, "/")}`
                        : `${BACKEND_BASE_URL}${doc}`;

                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition rounded-lg px-3 py-2 text-sm"
                        >
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-blue-300 hover:text-blue-400"
                          >
                            {fileName}
                          </a>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (doc && doc._id) {
                                  deleteDocumentFromServer(selected._id, doc._id);
                                } else {
                                  alert("⚠️ Cannot delete — invalid document ID.");
                                }
                              }}

                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              Delete
                            </button>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-600 text-xs"
                            >
                              View
                            </a>
                          </div>
                        </div>

                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-white/60 text-sm italic">No documents uploaded.</p>
              )}
            </div>
          )}
        </Modal>


        {/* ---------------- DELETE MODAL ---------------- */}
        <Modal
          open={modal.open && modal.type === "delete"}
          title="Confirm Deletion"
          onClose={closeModal}
          footer={
            <>
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </>
          }
        >
          <p className="text-white/90">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selected?.name}</span>? This action
            cannot be undone.
          </p>
        </Modal>

        {/* Pagination Controls */}
        {filtered.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
            {/* Left: Page info */}
            <p className="text-gray-600 text-sm">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-800">
                {Math.min(startIndex + itemsPerPage, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {filtered.length}
              </span>{" "}
              projects
            </p>

            {/* Right: Pagination buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-2 rounded-full border border-gray-300 text-sm flex items-center gap-1 ${currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
                  }`}
              >
                ‹ Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition ${currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-3 py-2 rounded-full border border-gray-300 text-sm flex items-center gap-1 ${currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
                  }`}
              >
                Next ›
              </button>
            </div>
          </div>
        )}


      </div>

    </div>


  );
}

export default CompanyProjects;
