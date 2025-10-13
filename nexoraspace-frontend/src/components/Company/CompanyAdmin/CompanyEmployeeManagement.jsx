import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  X,
  FilePlus2,
  FileText,
  Trash,
  Save,
  Calendar,
  Briefcase,
  User,
  Folder,
} from "lucide-react";
import SideMenu from "./SideMenu";

/* ---------- Fancy Modal Component ---------- */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
      <div
        onClick={onClose}
        className="absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-[#0d1321] to-[#141b2f]
        text-white shadow-2xl border border-white/10 ring-1 ring-white/10
        transform transition-all duration-300 scale-100 opacity-100 animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-white/10">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 active:scale-95 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scroll">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Field Wrapper ---------- */
const Field = ({ label, required, children, error }) => (
  <div className="space-y-1">
    <label className="text-sm text-white/80">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-300">{error}</p>}
  </div>
);

/* ---------- Document Manager ---------- */
function DocumentManager({ docs, setDocs }) {
  const addRow = () =>
    setDocs([...docs, { id: crypto.randomUUID(), name: "", file: null }]);
  const removeRow = (id) => setDocs(docs.filter((d) => d.id !== id));
  const updateRow = (id, patch) =>
    setDocs(docs.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/80 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Employee Documents
        </p>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 active:scale-95 transition"
        >
          <FilePlus2 className="h-4 w-4" /> Add Document
        </button>
      </div>

      {docs.length === 0 && (
        <p className="text-xs text-white/60">No documents added yet.</p>
      )}

      <div className="space-y-2">
        {docs.map((d, idx) => (
          <div
            key={d.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl border border-white/10 p-3 bg-white/5"
          >
            <div className="md:col-span-5">
              <input
                type="text"
                placeholder="Document name"
                value={d.name}
                onChange={(e) => updateRow(d.id, { name: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-6">
              <input
                type="file"
                onChange={(e) => updateRow(d.id, { file: e.target.files?.[0] })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-white/30"
              />
            </div>
            <div className="md:col-span-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => removeRow(d.id)}
                className="rounded-lg p-2 text-red-300 hover:bg-red-500/10 active:scale-95 transition"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */
function CompanyEmployeeManagement() {
  const positionOptions = [
    "Software Engineer",
    "Senior Engineer",
    "QA Engineer",
    "UI/UX Designer",
    "Project Manager",
    "HR",
  ];
  const projectOptions = [
    "AI Dashboard",
    "Mobile App Redesign",
    "Website Revamp",
    "Internal Tools",
    "Data Lake",
  ];
  const statusOptions = ["Active", "On Leave", "Inactive"];

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit@company.com",
      position: "Software Engineer",
      project: "AI Dashboard",
      status: "Active",
      joiningDate: "2022-03-15",
      documents: [],
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya@company.com",
      position: "UI/UX Designer",
      project: "Mobile App Redesign",
      status: "On Leave",
      joiningDate: "2023-01-05",
      documents: [],
    },
  ]);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "add" });
  const [selected, setSelected] = useState(null);

  const emptyForm = useMemo(
    () => ({
      name: "",
      email: "",
      position: positionOptions[0],
      project: projectOptions[0],
      status: statusOptions[0],
      joiningDate: "",
      documents: [],
    }),
    []
  );
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openModal = (type, emp = null) => {
    setErrors({});
    setSelected(emp);
    if (type === "edit" && emp) setForm({ ...emp, documents: [] });
    else setForm(emptyForm);
    setModal({ open: true, type });
  };
  const closeModal = () => setModal({ open: false, type: "add" });

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.joiningDate) e.joiningDate = "Select joining date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEmployee = () => {
    if (!validate()) return;
    if (modal.type === "add") {
      setEmployees([...employees, { id: Date.now(), ...form }]);
    } else if (modal.type === "edit" && selected) {
      setEmployees(
        employees.map((e) => (e.id === selected.id ? { ...form, id: e.id } : e))
      );
    }
    closeModal();
  };

  const deleteEmployee = () => {
    setEmployees(employees.filter((e) => e.id !== selected.id));
    closeModal();
  };

  const filtered = employees.filter((e) =>
    [e.name, e.email, e.position, e.project, e.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SideMenu />

      <div className="flex-1 p-6 pt-19 md:p-10 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2 text-blue-600" /> Employee Management
          </h1>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => openModal("add")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-5 w-5" /> Add Employee
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Position</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joining Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.position}</td>
                  <td className="p-3">{e.project}</td>
                  <td className="p-3">{e.status}</td>
                  <td className="p-3">{e.joiningDate}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button onClick={() => openModal("view", e)} className="text-blue-600">
                      <Eye />
                    </button>
                    <button onClick={() => openModal("edit", e)} className="text-green-600">
                      <Edit />
                    </button>
                    <button onClick={() => openModal("delete", e)} className="text-red-600">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- ADD / EDIT MODAL ---------- */}
        <Modal
          open={modal.open && (modal.type === "add" || modal.type === "edit")}
          title={modal.type === "add" ? "Add Employee" : "Edit Employee"}
          onClose={closeModal}
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={saveEmployee}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          }
        >
          <div className="grid gap-4">
            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 placeholder-white/40 focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 placeholder-white/40 focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Position" required>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {positionOptions.map((p) => (
                    <option key={p} className="bg-[#0d1321]">
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Project Assigned" required>
                <select
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {projectOptions.map((p) => (
                    <option key={p} className="bg-[#0d1321]">
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status" required>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} className="bg-[#0d1321]">
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Date of Joining" required error={errors.joiningDate}>
              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) =>
                  setForm({ ...form, joiningDate: e.target.value })
                }
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <DocumentManager
              docs={form.documents}
              setDocs={(d) => setForm({ ...form, documents: d })}
            />
          </div>
        </Modal>

        {/* ---------- VIEW MODAL ---------- */}
        <Modal
          open={modal.open && modal.type === "view"}
          title="Employee Profile"
          onClose={closeModal}
          footer={
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          }
        >
          {selected && (
            <div className="space-y-5">
              {/* Profile Section */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selected.name}</h3>
                  <p className="text-sm text-white/60">{selected.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-3 text-white/90">
                <p className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />{" "}
                  <span>{selected.position}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-yellow-400" />{" "}
                  <span>{selected.project}</span>
                </p>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-400" />{" "}
                  <span>{selected.status}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />{" "}
                  <span>{selected.joiningDate}</span>
                </p>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm text-white/70 mb-2">Documents:</h4>
                {selected.documents?.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {selected.documents.map((d) => (
                      <li key={d.id}>
                        {d.name || "Unnamed"}{" "}
                        {d.file ? (
                          <span className="text-white/60 text-xs">
                            ({d.file.name})
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50 text-sm">No documents uploaded.</p>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* ---------- DELETE MODAL ---------- */}
        <Modal
          open={modal.open && modal.type === "delete"}
          title="Delete Employee"
          onClose={closeModal}
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={deleteEmployee}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          }
        >
          <p className="text-white/85">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selected?.name}</span>? This action
            cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  );
}

export default CompanyEmployeeManagement;
