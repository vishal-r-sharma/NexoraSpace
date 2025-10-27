import React, { useState, useMemo, useEffect } from "react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../api/axios"; // ✅ axios instance (withCredentials: true)
import defaultlogo from "../../../assets/logo-white.png"

/* ---------- Fancy Modal ---------- */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
      <div onClick={onClose} className="absolute inset-0" aria-hidden="true" />
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-[#0d1321] to-[#141b2f]
        text-white shadow-2xl border border-white/10 ring-1 ring-white/10"
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
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 invoices per page


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

  // ✅ Auto-generate invoice number
  const generateUniqueInvoiceNo = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `INV-${day}${month}${year}-${randomNum}`;
  };

  /* ------------------------------------------------------------------
     🟩 FETCH COMPANY AND INVOICES FROM BACKEND
  ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await api.get("/api/company/data/check"); // ✅ route that gives logged-in company
        setCompany(res.data.company);
        if (res.data.company?._id) fetchInvoices(res.data.company._id);
      } catch (err) {
        console.error("❌ Company fetch failed:", err);
      }
    };
    fetchCompanyData();
  }, []);

  const fetchInvoices = async (companyRef) => {
    try {
      const res = await api.get(`/api/company/data/billing/list/${companyRef}`);
      if (res.data.success) setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("❌ Fetch invoices error:", err);
    }
  };

  /* ------------------------------------------------------------------
     🟩 SAVE / UPDATE / DELETE FUNCTIONS
  ------------------------------------------------------------------ */
  const validate = () => {
    const e = {};
    if (!form.client) e.client = "Client name required";
    if (!form.amount) e.amount = "Amount required";
    if (!form.issueDate) e.issueDate = "Select issue date";
    if (!form.dueDate) e.dueDate = "Select due date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveInvoice = async () => {
    if (!validate() || !company?._id) return;
    try {
      if (modal.type === "add") {
        const res = await api.post("/api/company/data/billing/add", {
          ...form,
          companyRef: company._id,
        });
        if (res.data.success) {
          setInvoices([res.data.invoice, ...invoices]);
        }
      } else if (modal.type === "edit" && selected?._id) {
        const res = await api.put(
          `/api/company/data/billing/${company._id}/${selected._id}`,
          form
        );
        if (res.data.success) {
          setInvoices(
            invoices.map((i) =>
              i._id === selected._id ? res.data.invoice : i
            )
          );
        }
      }
      closeModal();
    } catch (err) {
      console.error("❌ Save invoice error:", err);
    }
  };

  const deleteInvoice = async () => {
    try {
      await api.delete(
        `/api/company/data/billing/${company._id}/${selected._id}`
      );
      setInvoices(invoices.filter((i) => i._id !== selected._id));
      closeModal();
    } catch (err) {
      console.error("❌ Delete invoice error:", err);
    }
  };

  const openModal = (type, invoice = null) => {
    setErrors({});
    setSelected(invoice);
    if (type === "edit" && invoice) {
      setForm(invoice);
    } else {
      setForm({
        ...emptyForm,
        invoiceNo: generateUniqueInvoiceNo(),
      });
    }
    setModal({ open: true, type });
  };

  const closeModal = () => setModal({ open: false, type: "add" });

  // ✅ Convert image file (local import or remote URL) to Base64
  const loadImageAsBase64 = async (url) => {
    try {
      // Try remote image first
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("⚠️ Could not fetch image due to CORS:", url);
      return null;
    }
  };


  /* ------------------------------------------------------------------
     🧾 PDF GENERATION (Complete version with company details)
  ------------------------------------------------------------------ */
  const generatePDF = async (invoice) => {
    try {
      // ✅ Extract userId & companyId from URL
      const pathParts = window.location.pathname.split("/");
      const userId = pathParts[pathParts.length - 2];
      const companyId = pathParts[pathParts.length - 1];

      // ✅ Fetch full company details
      const companyRes = await api.get(`/api/company/data/user/${userId}/${companyId}`);
      const company = companyRes.data?.company || {};

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const color = [13, 19, 33];

      // Company info
      const companyName = company.companyName || "NexoraSpace Pvt. Ltd.";
      const companyAddress =
        company.registeredAddress
          ? `${company.registeredAddress}, ${company.city || ""}, ${company.state || ""}, ${company.country || ""} - ${company.pincode || ""}`
          : "B-45, Sector 62, Noida, Uttar Pradesh, India";
      const companyEmail = company.email || "support@nexoraspace.com";
      const companyPhone = company.phone || "+91 98765 43210";
      const bankName = company.bankName || "HDFC Bank Ltd.";
      const branch = company.branch || "Sector 62, Noida";
      const accountNumber = company.accountNumber || "123456789012";
      const ifscCode = company.ifscCode || "HDFC0001234";
      const gstNumber = company.gstNumber || "";
      const panNumber = company.panNumber || "";
      const cinNumber = company.cinNumber || "";

      /* ---------- Header Section ---------- */
      /* ---------- Header Section ---------- */
      doc.setFillColor(...color);
      doc.rect(0, 0, pageWidth, 90, "F");

      let logoBase64 = null;

      // ✅ Try remote company logo (convert to Base64)
      if (company.logoUrl && company.logoUrl.startsWith("http")) {
        logoBase64 = await loadImageAsBase64(company.logoUrl);
      }

      // ✅ If remote logo fails, fallback to local default (convert it properly)
      if (!logoBase64) {
        const imgResponse = await fetch(defaultlogo);
        const blob = await imgResponse.blob();
        const reader = new FileReader();
        logoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      // ✅ Now add it to PDF safely
      try {
        if (logoBase64) {
          doc.addImage(logoBase64, "PNG", 40, 25, 150, 60);
        } else {
          console.warn("⚠️ No logo added (Base64 unavailable)");
        }
      } catch (err) {
        console.warn("⚠️ Logo not added — invalid format", err);
      }



      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(companyName, 210, 45);

      doc.setFontSize(10);
      if (gstNumber) doc.text(`GST: ${gstNumber}`, 210, 60);
      if (panNumber) doc.text(`PAN: ${panNumber}`, 210, 72);
      if (cinNumber) doc.text(`CIN: ${cinNumber}`, 210, 84);
      doc.text(`Email: ${companyEmail}`, pageWidth - 220, 60);
      doc.text(`Phone: ${companyPhone}`, pageWidth - 220, 74);

      /* ---------- Title ---------- */
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", pageWidth / 2, 120, { align: "center" });

      /* ---------- Client Info ---------- */
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Bill To:", 40, 150);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.client || "—", 40, 165);
      doc.text(invoice.clientEmail || "—", 40, 180);
      doc.text(invoice.clientAddress || "—", 40, 195);

      /* ---------- Invoice Info ---------- */
      doc.setFont("helvetica", "bold");
      doc.text("Invoice Details:", pageWidth - 240, 150);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${invoice.invoiceNo}`, pageWidth - 240, 165);
      doc.text(`Issue Date: ${invoice.issueDate}`, pageWidth - 240, 180);
      doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 240, 195);
      doc.text(`Status: ${invoice.status}`, pageWidth - 240, 210);

      /* ---------- Table ---------- */
      autoTable(doc, {
        startY: 230,
        head: [["Description", "Total (INR)", "Paid (INR)", "Balance (INR)"]],
        body: [
          [
            invoice.projectName || invoice.notes || "—",
            `${invoice.amount?.toLocaleString() || "0"}`,
            `${invoice.paidAmount?.toLocaleString() || "0"}`,
            `${((invoice.amount || 0) - (invoice.paidAmount || 0)).toLocaleString()}`,
          ],
        ],
        styles: { fontSize: 11, halign: "center" },
        headStyles: { fillColor: color, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });

      const finalY = doc.lastAutoTable.finalY + 30;

      /* ---------- Payment Summary ---------- */
      const balance = (invoice.amount || 0) - (invoice.paidAmount || 0);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Summary", 40, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(`Subtotal: INR ${invoice.amount.toLocaleString()}`, 40, finalY + 20);
      doc.text(`Paid: INR ${invoice.paidAmount.toLocaleString()}`, 40, finalY + 40);
      doc.text(`Balance Due: INR ${balance.toLocaleString()}`, 40, finalY + 60);

      /* ---------- Bank Details ---------- */
      const bankY = finalY + 100;
      doc.setFont("helvetica", "bold");
      doc.text("Bank Details", 40, bankY);
      doc.setFont("helvetica", "normal");
      doc.text(`Bank: ${bankName}`, 40, bankY + 20);
      doc.text(`Branch: ${branch}`, 40, bankY + 35);
      doc.text(`A/C: ${accountNumber}`, 40, bankY + 50);
      doc.text(`IFSC: ${ifscCode}`, 40, bankY + 65);

      /* ---------- Digital Signature ---------- */
      const sigY = pageHeight - 120;
      doc.setFont("helvetica", "bold");
      doc.text("Digitally Signed & Verified", 40, sigY);
      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.text(`Signature ID: ${invoice._id || "N/A"}`, 40, sigY + 15);
      doc.text(`Timestamp: ${new Date().toLocaleString("en-IN")}`, 40, sigY + 30);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for your business!", pageWidth - 200, sigY + 30);


      doc.save(`${invoice.invoiceNo}.pdf`);
    } catch (err) {
      console.error("❌ PDF Error:", err);
      alert("Failed to generate invoice PDF");
    }
  };


  /* ---------- SUMMARY ---------- */
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce(
    (sum, i) => sum + (i.amount - i.paidAmount),
    0
  );
  const totalOverdue = invoices
    .filter((i) => {
      const due = new Date(i.dueDate);
      const today = new Date();
      const isOverdue = today > due && (i.amount - i.paidAmount) > 0;
      return isOverdue;
    })
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  const pendingInvoices = invoices.filter(
    (i) => i.status === "Pending" || i.status === "Partial"
  ).length;

  const filtered = invoices.filter((i) =>
    [i.invoiceNo, i.client, i.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 p-6 md:p-10 overflow-auto space-y-6">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()} (${invoices.filter(i => i.paidAmount > 0).length} invoices)`}
            icon={<Wallet />}
            color="green"
          />
          <SummaryCard
            title="Outstanding Balance"
            value={`₹${totalOutstanding.toLocaleString()} (${invoices.filter(i => (i.amount - i.paidAmount) > 0).length} invoices)`}
            icon={<BarChart3 />}
            color="yellow"
          />
          <SummaryCard
            title="Overdue Amount"
            value={`₹${totalOverdue.toLocaleString()} (${invoices.filter(i => {
              const due = new Date(i.dueDate);
              const today = new Date();
              return today > due && (i.amount - i.paidAmount) > 0;
            }).length} invoices)`}
            icon={<ArrowDownCircle />}
            color="red"
          />

          <SummaryCard
            title="Pending Invoices"
            value={`${pendingInvoices} Pending`}
            icon={<TrendingUp />}
            color="blue"
          />
        </div>
        <div className="flex justify-end items-center gap-2 mb-2 text-sm text-gray-600">
          <span>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-white text-gray-800"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num} / page
              </option>
            ))}
          </select>
        </div>


        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Issue Date</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInvoices.map((i) => (
                <tr key={i._id} className="border-b transition hover:bg-gray-50">
                  <td className="p-3">{i.invoiceNo}</td>
                  <td className="p-3">{i.client}</td>
                  <td className="p-3">{i.projectName || "—"}</td>
                  <td className="p-3">{i.issueDate ? new Date(i.issueDate).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="p-3">{i.dueDate ? new Date(i.dueDate).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="p-3">₹{i.amount.toLocaleString()}</td>
                  <td className="p-3">₹{i.paidAmount.toLocaleString()}</td>
                  <td className={`p-3 font-medium ${i.status === "Paid"
                    ? "text-green-600"
                    : i.status === "Overdue"
                      ? "text-red-600"
                      : "text-yellow-600"
                    }`}>
                    {i.status}
                  </td>

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

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Page:</span>
            <span className="font-medium">{currentPage}</span>
            <span className="text-gray-500 text-xs">/ {totalPages}</span>
          </div>

          {/* Pagination Controls */}
          {filtered.length > 0 && filtered.length > itemsPerPage && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-gray-600 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.min(startIndex + itemsPerPage, filtered.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">{filtered.length}</span> invoices
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-2 rounded-full border border-gray-300 text-sm flex items-center gap-1 transition text-gray-800 cursor-pointer ${currentPage === 1
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
                    className={`px-3 py-2 rounded-full border border-gray-300 text-sm flex items-center gap-1 transition ${currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    Next ›
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>


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

/* ---------- SummaryCard ---------- */
const SummaryCard = ({ title, value, icon, color }) => {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className={`text-xl font-semibold ${colorMap[color]}`}>
          {typeof value === "number" ? `₹${value.toLocaleString()}` : value}
        </h2>
      </div>
      <div className={`${colorMap[color]} h-10 w-10`}>{icon}</div>
    </div>
  );
};


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
              readOnly
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-gray-400 cursor-not-allowed"
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
                <option key={s} className="bg-[#0d1321]">
                  {s}
                </option>
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
              <p>
                <strong>Client:</strong> {selected.client}
              </p>
              <p>
                <strong>Status:</strong> {selected.status}
              </p>
              <p>
                <strong>Issue Date:</strong> {selected.issueDate}
              </p>
              <p>
                <strong>Due Date:</strong> {selected.dueDate}
              </p>
              <p>
                <strong>Total:</strong> ₹{selected.amount.toLocaleString()}
              </p>
              <p>
                <strong>Paid:</strong> ₹{selected.paidAmount.toLocaleString()}
              </p>
              <p>
                <strong>Balance:</strong> ₹
                {(selected.amount - selected.paidAmount).toLocaleString()}
              </p>
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
          <span className="font-semibold">{selected?.invoiceNo}</span>? This
          action cannot be undone.
        </p>
      </Modal>

    </>
  );
}

export default CompanyFinance;
