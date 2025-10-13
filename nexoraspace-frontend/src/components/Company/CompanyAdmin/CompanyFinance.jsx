import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  FileText,
  Download,
  BarChart3,
  Wallet,
  TrendingUp,
  ArrowDownCircle,
} from "lucide-react";
import SideMenu from "./SideMenu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo.png"; // ✅ PNG logo only (no SVG)

/* ---------- Fancy Modal ---------- */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
      <div onClick={onClose} className="absolute inset-0" aria-hidden="true" />
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-[#0d1321] to-[#141b2f]
        text-white shadow-2xl border border-white/10 ring-1 ring-white/10
        transform transition-all duration-300 animate-[fadeIn_0.3s_ease-out]"
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

/* ---------- MAIN COMPONENT ---------- */
function CompanyFinance() {
  const statusOptions = ["Paid", "Pending", "Overdue", "Partial"];
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "add" });
  const [selected, setSelected] = useState(null);

  const [invoices, setInvoices] = useState([
  {
    id: 1,
    invoiceNo: "INV-1001",
    client: "TechNova Ltd.",
    clientEmail: "billing@technova.com",
    clientAddress: "Plot 45, Cyber Park, Bengaluru",
    projectName: "AI Analytics Platform",
    issueDate: "2024-09-10",
    dueDate: "2024-09-25",
    amount: 250000,
    paidAmount: 250000,
    paymentTerms: "Net 15 days",
    notes: "Milestone 1 payment completed.",
    status: "Paid",
    description: "AI Analytics project milestone 1 payment",
  },
  {
    id: 2,
    invoiceNo: "INV-1002",
    client: "UrbanConnect Pvt. Ltd.",
    clientEmail: "accounts@urbanconnect.in",
    clientAddress: "25, IT Park Road, Pune, Maharashtra",
    projectName: "IoT Smart Lighting System",
    issueDate: "2024-10-05",
    dueDate: "2024-10-20",
    amount: 480000,
    paidAmount: 200000,
    paymentTerms: "Net 30 days",
    notes: "Initial hardware setup completed.",
    status: "Partial",
    description: "IoT hardware installation for Smart City project",
  },
  {
    id: 3,
    invoiceNo: "INV-1003",
    client: "FinSecure Bank",
    clientEmail: "finance@finsecurebank.com",
    clientAddress: "Bank Tower, Connaught Place, New Delhi",
    projectName: "Blockchain Integration",
    issueDate: "2024-08-01",
    dueDate: "2024-08-15",
    amount: 400000,
    paidAmount: 0,
    paymentTerms: "Net 14 days",
    notes: "Awaiting first milestone payment.",
    status: "Overdue",
    description: "Blockchain integration for secure ledger system",
  },
  {
    id: 4,
    invoiceNo: "INV-1004",
    client: "HealthAxis Technologies",
    clientEmail: "finance@healthaxis.io",
    clientAddress: "Plot 9, Health Valley, Hyderabad",
    projectName: "Cloud Health Data Migration",
    issueDate: "2024-09-20",
    dueDate: "2024-10-10",
    amount: 320000,
    paidAmount: 320000,
    paymentTerms: "Immediate on delivery",
    notes: "Final milestone approved.",
    status: "Paid",
    description: "Migration of hospital data to AWS secure cloud",
  },
  {
    id: 5,
    invoiceNo: "INV-1005",
    client: "GreenEnergy Corp.",
    clientEmail: "billing@greenenergy.in",
    clientAddress: "Solar Park, Ahmedabad, Gujarat",
    projectName: "Energy IoT Dashboard",
    issueDate: "2024-09-15",
    dueDate: "2024-09-30",
    amount: 600000,
    paidAmount: 300000,
    paymentTerms: "Net 30 days",
    notes: "50% advance received.",
    status: "Partial",
    description: "Custom IoT dashboard for solar panel analytics",
  },
  {
    id: 6,
    invoiceNo: "INV-1006",
    client: "EduSmart Academy",
    clientEmail: "accounts@edusmart.edu",
    clientAddress: "Sector 21, Gurugram, Haryana",
    projectName: "Learning Management System (LMS)",
    issueDate: "2024-10-01",
    dueDate: "2024-10-15",
    amount: 280000,
    paidAmount: 0,
    paymentTerms: "Net 15 days",
    notes: "Payment pending after LMS delivery.",
    status: "Pending",
    description: "Development of AI-based e-learning portal",
  },
  {
    id: 7,
    invoiceNo: "INV-1007",
    client: "NextRetail Pvt. Ltd.",
    clientEmail: "finance@nextretail.com",
    clientAddress: "Shop Mall Complex, Mumbai, Maharashtra",
    projectName: "POS Software Upgrade",
    issueDate: "2024-09-05",
    dueDate: "2024-09-25",
    amount: 180000,
    paidAmount: 180000,
    paymentTerms: "Net 20 days",
    notes: "Project delivered successfully.",
    status: "Paid",
    description: "Upgraded retail POS system with analytics support",
  },
  {
    id: 8,
    invoiceNo: "INV-1008",
    client: "BuildRight Constructions",
    clientEmail: "accounts@buildright.in",
    clientAddress: "Plot 4, Ring Road, Chennai",
    projectName: "AI Safety Monitoring System",
    issueDate: "2024-08-10",
    dueDate: "2024-09-10",
    amount: 350000,
    paidAmount: 150000,
    paymentTerms: "Net 30 days",
    notes: "Balance to be cleared after site test.",
    status: "Overdue",
    description: "AI-based camera system for construction safety",
  },
  {
    id: 9,
    invoiceNo: "INV-1009",
    client: "TravelSphere Pvt. Ltd.",
    clientEmail: "billing@travelsphere.co.in",
    clientAddress: "Infocity, Gandhinagar, Gujarat",
    projectName: "Travel Booking API Integration",
    issueDate: "2024-09-25",
    dueDate: "2024-10-15",
    amount: 150000,
    paidAmount: 150000,
    paymentTerms: "Net 20 days",
    notes: "Full payment received before deployment.",
    status: "Paid",
    description: "Integrated booking API with CRM for travel portal",
  },
  {
    id: 10,
    invoiceNo: "INV-1010",
    client: "AquaFlow Systems",
    clientEmail: "finance@aquaflow.io",
    clientAddress: "Tech Park, Kochi, Kerala",
    projectName: "IoT Water Flow Monitoring",
    issueDate: "2024-10-01",
    dueDate: "2024-10-20",
    amount: 220000,
    paidAmount: 110000,
    paymentTerms: "Net 20 days",
    notes: "Phase 1 delivered successfully.",
    status: "Partial",
    description: "Deployment of IoT water metering system",
  },
  {
    id: 11,
    invoiceNo: "INV-1011",
    client: "MediQuick Labs",
    clientEmail: "accounts@mediquicklab.com",
    clientAddress: "Sector 18, Noida, Uttar Pradesh",
    projectName: "Diagnostic Data Platform",
    issueDate: "2024-09-12",
    dueDate: "2024-09-28",
    amount: 310000,
    paidAmount: 310000,
    paymentTerms: "Immediate",
    notes: "All deliverables completed and verified.",
    status: "Paid",
    description: "Cloud-based diagnostics platform for lab data",
  },
]);


  const emptyForm = useMemo(
    () => ({
      invoiceNo: "",
      client: "",
      clientEmail: "",
      clientAddress: "",
      projectName: "",
      issueDate: "",
      dueDate: "",
      amount: "",
      paidAmount: "",
      paymentTerms: "",
      notes: "",
      status: "Pending",
      description: "",
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openModal = (type, invoice = null) => {
    setErrors({});
    setSelected(invoice);
    if (type === "edit" && invoice) setForm(invoice);
    else setForm(emptyForm);
    setModal({ open: true, type });
  };
  const closeModal = () => setModal({ open: false, type: "add" });

  const validate = () => {
    const e = {};
    if (!form.invoiceNo) e.invoiceNo = "Invoice number required";
    if (!form.client) e.client = "Client name required";
    if (!form.amount) e.amount = "Amount required";
    if (!form.issueDate) e.issueDate = "Select issue date";
    if (!form.dueDate) e.dueDate = "Select due date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveInvoice = () => {
    if (!validate()) return;
    if (modal.type === "add") {
      setInvoices([{ id: Date.now(), ...form }, ...invoices]);
    } else if (modal.type === "edit" && selected) {
      setInvoices(
        invoices.map((i) => (i.id === selected.id ? { ...form, id: i.id } : i))
      );
    }
    closeModal();
  };

  const deleteInvoice = () => {
    setInvoices(invoices.filter((i) => i.id !== selected.id));
    closeModal();
  };

  /* ---------- FIXED PDF GENERATOR ---------- */
  const generatePDF = (invoice) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const color = [41, 128, 185];

    const companyName = "NexoraSpace Pvt. Ltd.";
    const companyAddress = "B-45, Sector 62, Noida, Uttar Pradesh, India";
    const companyEmail = "support@nexoraspace.com";
    const companyPhone = "+91 98765 43210";

    // Header
    doc.setFillColor(...color);
    doc.rect(0, 0, pageWidth, 90, "F");
    doc.addImage(logo, "PNG", 40, 25, 90, 40);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("INVOICE", pageWidth - 140, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Email: ${companyEmail}`, pageWidth - 200, 70);
    doc.text(`Phone: ${companyPhone}`, pageWidth - 200, 82);

    // Bill To
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 40, 130);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.client || "—", 40, 145);
    doc.text(invoice.clientEmail || "—", 40, 160);
    doc.text(invoice.clientAddress || "—", 40, 175);

    // Invoice Info
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", pageWidth - 240, 130);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoice.invoiceNo}`, pageWidth - 240, 145);
    doc.text(`Issue Date: ${invoice.issueDate}`, pageWidth - 240, 160);
    doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 240, 175);
    doc.text(`Status: ${invoice.status}`, pageWidth - 240, 190);

    // Project
    doc.setFont("helvetica", "bold");
    doc.text("Project:", 40, 210);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.projectName || "—", 110, 210);

    // Description
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 40, 230);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.description || "—", 130, 230, { maxWidth: pageWidth - 160 });

    // Table
    autoTable(doc, {
      startY: 250,
      head: [["Particulars", "Total (₹)", "Paid (₹)", "Balance (₹)"]],
      body: [
        [
          invoice.notes || "—",
          invoice.amount?.toLocaleString() || "0",
          invoice.paidAmount?.toLocaleString() || "0",
          ((invoice.amount || 0) - (invoice.paidAmount || 0)).toLocaleString(),
        ],
      ],
      styles: { fontSize: 11, halign: "center" },
      headStyles: { fillColor: color, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    const balance = (invoice.amount || 0) - (invoice.paidAmount || 0);

    // Payment Summary box
    const boxWidth = 230;
    const boxX = pageWidth - boxWidth - 50;
    const boxY = finalY;
    doc.setDrawColor(...color);
    doc.roundedRect(boxX, boxY, boxWidth, 100, 5, 5);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", boxX + 20, boxY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ₹${invoice.amount.toLocaleString()}`, boxX + 20, boxY + 40);
    doc.text(`Paid: ₹${invoice.paidAmount.toLocaleString()}`, boxX + 20, boxY + 60);
    doc.text(`Balance Due: ₹${balance.toLocaleString()}`, boxX + 20, boxY + 80);

    // Terms & Notes
    doc.setFont("helvetica", "bold");
    doc.text("Payment Terms:", 40, boxY + 30);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.paymentTerms || "—", 160, boxY + 30);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 40, boxY + 50);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.notes || "—", 100, boxY + 50, { maxWidth: 350 });

    // Digital Signature
    const sigId = `SIG-${Math.floor(Math.random() * 1000000)}`;
    const sigDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    doc.setDrawColor(200);
    doc.line(40, pageHeight - 120, pageWidth - 40, pageHeight - 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Digitally Signed & Verified", 40, pageHeight - 100);
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text(`Signer: ${companyName}`, 40, pageHeight - 85);
    doc.text(`Signature ID: ${sigId}`, 40, pageHeight - 70);
    doc.text(`Timestamp: ${sigDate}`, 40, pageHeight - 55);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", pageWidth - 200, pageHeight - 55);

    doc.save(`${invoice.invoiceNo}.pdf`);
  };

  /* ---------- Financial Summary ---------- */
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce(
    (sum, i) => sum + (i.amount - i.paidAmount),
    0
  );
  const totalOverdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);
  const pendingInvoices = invoices.filter(
    (i) => i.status === "Pending" || i.status === "Partial"
  ).length;

  const filtered = invoices.filter((i) =>
    [i.invoiceNo, i.client, i.status].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SideMenu />
      <div className="flex-1 p-6 md:p-10 overflow-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-2 text-blue-600" /> Company Finance & Billing
          </h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => openModal("add")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-5 w-5" /> Create Invoice
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Revenue" value={totalRevenue} icon={<Wallet />} color="green" />
          <SummaryCard title="Outstanding Balance" value={totalOutstanding} icon={<BarChart3 />} color="yellow" />
          <SummaryCard title="Overdue Amount" value={totalOverdue} icon={<ArrowDownCircle />} color="red" />
          <SummaryCard title="Pending Invoices" value={pendingInvoices} icon={<TrendingUp />} color="blue" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{i.invoiceNo}</td>
                  <td className="p-3">{i.client}</td>
                  <td className="p-3">{i.projectName || "—"}</td>
                  <td className="p-3">₹{i.amount.toLocaleString()}</td>
                  <td className="p-3">₹{i.paidAmount.toLocaleString()}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button onClick={() => openModal("view", i)} className="text-blue-600"><Eye /></button>
                    <button onClick={() => openModal("edit", i)} className="text-green-600"><Edit /></button>
                    <button onClick={() => openModal("delete", i)} className="text-red-600"><Trash2 /></button>
                    <button onClick={() => generatePDF(i)} className="text-indigo-600"><Download /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODALS */}
        {modal.open && (
          <InvoiceModals
            modal={modal}
            closeModal={closeModal}
            saveInvoice={saveInvoice}
            deleteInvoice={deleteInvoice}
            form={form}
            setForm={setForm}
            errors={errors}
            statusOptions={statusOptions}
            selected={selected}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- HELPER COMPONENTS ---------- */
const SummaryCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-xl font-semibold text-${color}-600`}>
        {typeof value === "number" ? `₹${value.toLocaleString()}` : value}
      </h2>
    </div>
    <div className={`text-${color}-500 h-10 w-10`}>{icon}</div>
  </div>
);

function InvoiceModals({
  modal,
  closeModal,
  saveInvoice,
  deleteInvoice,
  form,
  setForm,
  errors,
  statusOptions,
  selected,
}) {
  return (
    <>
      {/* ADD / EDIT */}
      <Modal
        open={modal.type === "add" || modal.type === "edit"}
        title={modal.type === "add" ? "Create Invoice" : "Edit Invoice"}
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
              onClick={saveInvoice}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
            >
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Field label="Invoice Number" required error={errors.invoiceNo}>
            <input
              type="text"
              value={form.invoiceNo}
              onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Client Name" required error={errors.client}>
            <input
              type="text"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Client Email">
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Client Address">
            <textarea
              rows="2"
              value={form.clientAddress}
              onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Project Name">
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Issue Date" required error={errors.issueDate}>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </Field>
            <Field label="Due Date" required error={errors.dueDate}>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </Field>
          </div>
          <Field label="Total Amount" required error={errors.amount}>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Paid Amount">
            <input
              type="number"
              value={form.paidAmount || ""}
              onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Payment Terms">
            <input
              type="text"
              value={form.paymentTerms}
              onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Notes">
            <textarea
              rows="2"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((s) => (
                <option key={s} className="bg-[#0d1321]">{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>

      {/* VIEW */}
      <Modal
        open={modal.type === "view"}
        title="Invoice Details"
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{selected.invoiceNo}</h2>
            <p className="text-white/70">{selected.description}</p>
            <div className="grid md:grid-cols-2 gap-3 text-white/90">
              <p><strong>Client:</strong> {selected.client}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Issue Date:</strong> {selected.issueDate}</p>
              <p><strong>Due Date:</strong> {selected.dueDate}</p>
              <p><strong>Total:</strong> ₹{selected.amount.toLocaleString()}</p>
              <p><strong>Paid:</strong> ₹{selected.paidAmount.toLocaleString()}</p>
              <p><strong>Balance:</strong> ₹{(selected.amount - selected.paidAmount).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE */}
      <Modal
        open={modal.type === "delete"}
        title="Delete Invoice"
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
              onClick={deleteInvoice}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-white/85">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selected?.invoiceNo}</span>? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}

export default CompanyFinance;
