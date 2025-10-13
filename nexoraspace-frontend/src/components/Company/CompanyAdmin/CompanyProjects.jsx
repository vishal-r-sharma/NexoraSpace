import React, { useState, useMemo } from "react";
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    BrainCircuit,
    X, FolderGit2,
    Save,
    Calendar,
    DollarSign,
    Building2,
    User,
    FileText,
    Layers,
    Users,
    Search,
} from "lucide-react";
import SideMenu from "./SideMenu";

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
                        {project.startDate} → {project.endDate}
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
                    <button
                        onClick={onEdit}
                        className="text-green-600 hover:text-green-800"
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onAI}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        <BrainCircuit className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ----------------- MAIN COMPONENT ----------------- */
function CompanyProjects() {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "AI Analytics Platform",
            client: "TechNova Ltd.",
            status: "Active",
            budget: "₹25,00,000",
            startDate: "2024-02-10",
            endDate: "2024-12-20",
            manager: "Amit Sharma",
            technology: "React, Python, TensorFlow",
            team: ["Amit", "Priya", "Rahul"],
            description:
                "An advanced analytics dashboard powered by AI for predictive insights and anomaly detection.",
            documents: ["Proposal.pdf", "SRS.docx"],
        },
        {
            id: 2,
            name: "Smart City IoT Network",
            client: "UrbanConnect Pvt. Ltd.",
            status: "Planning",
            budget: "₹48,00,000",
            startDate: "2025-01-05",
            endDate: "2025-10-25",
            manager: "Riya Patel",
            technology: "Node.js, MQTT, AWS IoT Core",
            team: ["Riya", "Arjun", "Simran"],
            description:
                "IoT-based city monitoring platform for traffic, streetlights, and air quality management with real-time analytics.",
            documents: ["Requirements.pdf", "Network_Design.png"],
        },
        {
            id: 3,
            name: "Blockchain Payment Gateway",
            client: "FinSecure Bank",
            status: "Active",
            budget: "₹55,00,000",
            startDate: "2024-08-01",
            endDate: "2025-05-30",
            manager: "Karan Mehta",
            technology: "Solidity, Ethereum, Node.js",
            team: ["Karan", "Sanya", "Deepak"],
            description:
                "A decentralized blockchain-based payment gateway integrating smart contracts for secure transactions.",
            documents: ["Architecture.pdf", "SmartContracts.sol"],
        },
        {
            id: 4,
            name: "E-Commerce AI Chatbot",
            client: "ShopEase Online",
            status: "Completed",
            budget: "₹18,00,000",
            startDate: "2023-09-15",
            endDate: "2024-03-10",
            manager: "Sakshi Jain",
            technology: "Python, NLP, Dialogflow, Firebase",
            team: ["Sakshi", "Vikas", "Rohit"],
            description:
                "AI chatbot system for customer interaction, product search, and personalized recommendations.",
            documents: ["Final_Report.pdf", "Training_Data.csv"],
        },
        {
            id: 5,
            name: "Healthcare Record System",
            client: "MedLife Hospitals",
            status: "Active",
            budget: "₹42,00,000",
            startDate: "2024-07-01",
            endDate: "2025-04-15",
            manager: "Neha Sharma",
            technology: "Angular, Node.js, MongoDB, REST API",
            team: ["Neha", "Tarun", "Shivani"],
            description:
                "Electronic Health Record system for patient data storage, appointment management, and data analytics.",
            documents: ["Wireframe.pdf", "Data_Model.docx"],
        },
        {
            id: 6,
            name: "Cybersecurity Threat Analyzer",
            client: "SecureNet Solutions",
            status: "Planning",
            budget: "₹35,00,000",
            startDate: "2025-02-01",
            endDate: "2025-11-10",
            manager: "Ankit Verma",
            technology: "Python, ELK Stack, Machine Learning",
            team: ["Ankit", "Mehul", "Tina"],
            description:
                "AI-driven threat detection and analysis platform to monitor logs and predict cybersecurity risks.",
            documents: ["SystemOverview.pdf", "ThreatModel.pptx"],
        },
        {
            id: 7,
            name: "Cloud-based Learning Portal",
            client: "EduVerse Pvt. Ltd.",
            status: "Completed",
            budget: "₹28,00,000",
            startDate: "2023-10-20",
            endDate: "2024-06-15",
            manager: "Divya Rao",
            technology: "React, Node.js, AWS Lambda, DynamoDB",
            team: ["Divya", "Kiran", "Arnav"],
            description:
                "A cloud-hosted e-learning portal supporting video lectures, AI quizzes, and user progress tracking.",
            documents: ["ProjectPlan.pdf", "DeploymentGuide.docx"],
        },
    ]);


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

    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files).map((f) => f.name);
        setForm({ ...form, documents: [...form.documents, ...files] });
    };

    const deleteDocument = (index) => {
        const updatedDocs = form.documents.filter((_, i) => i !== index);
        setForm({ ...form, documents: updatedDocs });
    };

    const saveProject = () => {
        if (!form.name || !form.client) return alert("Please fill required fields");
        if (modal.type === "add")
            setProjects([...projects, { ...form, id: Date.now() }]);
        else
            setProjects(
                projects.map((p) => (p.id === selected.id ? { ...form } : p))
            );
        closeModal();
    };

    const deleteProject = () => {
        setProjects(projects.filter((p) => p.id !== selected.id));
        closeModal();
    };

    const filtered = projects.filter((p) => {
        if (statusFilter !== "All" && p.status !== statusFilter) return false;
        if (
            search &&
            !`${p.name} ${p.client}`.toLowerCase().includes(search.toLowerCase())
        )
            return false;
        return true;
    });

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <SideMenu />
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

                {/* Projects */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((proj) => (
                        <ProjectCard
                            key={proj.id}
                            project={proj}
                            onView={() => openModal("view", proj)}
                            onEdit={() => openModal("edit", proj)}
                            onDelete={() => openModal("delete", proj)}
                            onAI={() => alert("AI Workspace coming soon 🚀")}
                        />
                    ))}
                </div>

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
                                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                        </>
                    }
                >
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Project Name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="text"
                            placeholder="Client *"
                            value={form.client}
                            onChange={(e) => setForm({ ...form, client: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="text"
                            placeholder="Manager"
                            value={form.manager}
                            onChange={(e) => setForm({ ...form, manager: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="text"
                            placeholder="Technology Stack"
                            value={form.technology}
                            onChange={(e) => setForm({ ...form, technology: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="text"
                            placeholder="Team Members (comma separated)"
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
                            placeholder="Budget *"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white"
                        />
                        <input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            className="bg-white/10 rounded-lg px-3 py-2 border border-white/20 text-white"
                        />
                        <select
                            value={form.status}
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
                            placeholder="Project Description"
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
                                    {form.documents.map((doc, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2"
                                        >
                                            <span>{doc}</span>
                                            <button
                                                onClick={() => deleteDocument(i)}
                                                className="text-red-400 hover:text-red-600 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
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
                        <div className="space-y-3 text-white/90">
                            <h2 className="text-2xl font-bold">{selected.name}</h2>
                            <p className="text-white/70">{selected.description}</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p>
                                    <strong>Client:</strong> {selected.client}
                                </p>
                                <p>
                                    <strong>Manager:</strong> {selected.manager}
                                </p>
                                <p>
                                    <strong>Status:</strong> {selected.status}
                                </p>
                                <p>
                                    <strong>Budget:</strong> {selected.budget}
                                </p>
                                <p>
                                    <strong>Timeline:</strong> {selected.startDate} →{" "}
                                    {selected.endDate}
                                </p>
                                <p>
                                    <strong>Technology:</strong> {selected.technology}
                                </p>
                            </div>
                            {selected.team && (
                                <p>
                                    <strong>Team Members:</strong> {selected.team.join(", ")}
                                </p>
                            )}
                            {selected.documents?.length > 0 && (
                                <div>
                                    <strong>Documents:</strong>
                                    <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
                                        {selected.documents.map((d, i) => (
                                            <li key={i}>{d}</li>
                                        ))}
                                    </ul>
                                </div>
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
            </div>
        </div>
    );
}

export default CompanyProjects;
