import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CompanyBilling = () => {
  // Company Info
  const [companyName, setCompanyName] = useState("TechCorp Inc.");
  const [companyAddress, setCompanyAddress] = useState("123 Main St, City, Country");

  // Client Info
  const [clientName, setClientName] = useState("Client Company Ltd.");
  const [clientEmail, setClientEmail] = useState("client@mail.com");
  const [taxId, setTaxId] = useState("GST123456");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 days");
  const [dueDate, setDueDate] = useState("2025-09-30");

  // Projects + Invoice Items
  const [selectedProject, setSelectedProject] = useState("Project A — In Progress");
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, description: "Project A — Implementation of core modules", amount: 120000 },
  ]);

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { id: Date.now(), description: "", amount: 0 }]);
  };
  const removeInvoiceItem = (id) =>
    setInvoiceItems(invoiceItems.filter((i) => i.id !== id));
  const updateInvoiceItem = (id, field, value) => {
    setInvoiceItems(
      invoiceItems.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const totalAmount = invoiceItems.reduce((sum, i) => sum + Number(i.amount), 0);

  const currentDate = new Date().toLocaleDateString();
  const invoiceNumber = Math.random().toString().slice(2, 8).toUpperCase();

  // ✅ Generate Professional PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20).setTextColor(40);
    doc.text("INVOICE", 14, 20);
    doc.setFontSize(11).setTextColor(100);
    doc.text(`Date: ${currentDate}`, 14, 30);
    doc.text(`Invoice #: ${invoiceNumber}`, 14, 36);
    doc.text(`Due Date: ${dueDate}`, 14, 42);

    // Company Info
    doc.setFontSize(12).setTextColor(20);
    doc.text("From:", 14, 55);
    doc.setFontSize(11).setTextColor(80);
    doc.text(companyName, 14, 61);
    doc.text(companyAddress, 14, 67);

    // Client Info
    doc.setFontSize(12).setTextColor(20);
    doc.text("Bill To:", 120, 55);
    doc.setFontSize(11).setTextColor(80);
    doc.text(clientName, 120, 61);
    doc.text(clientEmail, 120, 67);
    doc.text(`Tax ID: ${taxId}`, 120, 73);
    doc.text(`Terms: ${paymentTerms}`, 120, 79);

    // Table
    const tableRows = invoiceItems.map((i) => [
      i.description,
      `$${Number(i.amount).toLocaleString()}`,
    ]);
    tableRows.push(["Total", `$${totalAmount.toLocaleString()}`]);

    autoTable(doc, {
      head: [["Description", "Amount"]],
      body: tableRows,
      startY: 95,
      theme: "grid",
      styles: { fillColor: [250, 250, 250], textColor: 20 },
      headStyles: { fillColor: [88, 28, 135], textColor: 255 }, // Purple header
    });

    // Footer
    doc.setFontSize(10).setTextColor(120);
    doc.text("Thank you for your business.", 14, doc.lastAutoTable.finalY + 15);

    // Save
    doc.save(`invoice_${invoiceNumber}.pdf`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-2">Billing System</h1>
      <p className="text-gray-400 mb-6">Generate invoices and manage billing</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT FORM */}
        <div className="flex-1 space-y-6">
          {/* Company Info */}
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={companyName} onChange={e=>setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Company Address</label>
            <textarea className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={companyAddress} onChange={e=>setCompanyAddress(e.target.value)} />
          </div>

          {/* Client Info */}
          <div>
            <label className="block text-sm mb-1">Client Name</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={clientName} onChange={e=>setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Client Email</label>
            <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={clientEmail} onChange={e=>setClientEmail(e.target.value)} />
          </div>

          {/* Tax, Terms, Due */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Tax ID / GST</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                value={taxId} onChange={e=>setTaxId(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Payment Terms</label>
              <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                value={paymentTerms} onChange={e=>setPaymentTerms(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Due Date</label>
            <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm mb-1">Project</label>
            <select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2">
              <option>Project A — In Progress</option>
              <option>Project B — Completed</option>
              <option>Project C — Planning</option>
            </select>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Invoice Items</span>
              <button onClick={addInvoiceItem} className="text-purple-400">+ Add</button>
            </div>
            <div className="space-y-2">
              {invoiceItems.map(item=>(
                <div key={item.id} className="flex flex-col sm:flex-row gap-2">
                  <input className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1"
                    value={item.description} placeholder="Description"
                    onChange={e=>updateInvoiceItem(item.id,"description",e.target.value)} />
                  <input type="number" className="sm:w-28 bg-gray-800 border border-gray-700 rounded px-2 py-1"
                    value={item.amount} placeholder="0"
                    onChange={e=>updateInvoiceItem(item.id,"amount",e.target.value)} />
                  <button onClick={()=>removeInvoiceItem(item.id)} className="text-red-400">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* Total + Button */}
          <div className="flex justify-between border-t border-gray-700 pt-4">
            <span>Total</span>
            <span className="font-bold">${totalAmount.toLocaleString()}</span>
          </div>
          <button onClick={generatePDF}
            className="bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded font-medium w-full">
            Generate & Download PDF
          </button>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="bg-white text-black p-4 rounded">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="font-bold text-xl">Invoice</h2>
                  <p>{companyName}</p><p className="text-xs">{companyAddress}</p>
                </div>
                <div className="text-sm text-right">
                  <p>Date: {currentDate}</p>
                  <p>Invoice #: {invoiceNumber}</p>
                  <p>Due: {dueDate}</p>
                </div>
              </div>
              <div className="mb-3 text-sm">
                <strong>Bill To:</strong>
                <p>{clientName}</p>
                <p>{clientEmail}</p>
                <p>{paymentTerms}</p>
              </div>
              <div className="mb-3"><strong>Project:</strong> {selectedProject}</div>
              <div className="border-t pt-2 text-sm">
                {invoiceItems.map(i=>(
                  <div key={i.id} className="flex justify-between">
                    <span>{i.description}</span>
                    <span>${Number(i.amount).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Thank you for your business!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBilling;