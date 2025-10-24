const express = require("express");
const router = express.Router();
const { CompanyBilling } = require("../models/billing.model");
const { CompanyDetail } = require("../models/companyDetail.model");
const companyAuth = require("../middleware/companyAuth");

// ensure JSON content type
router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/* ------------------------------------------------------
   ✅ 1️⃣ Get All Invoices of a Company
   /api/company/data/billing/list/:companyRef
------------------------------------------------------ */
router.get("/list/:companyRef", companyAuth, async (req, res) => {
  try {
    const { companyRef } = req.params;
    const billingDoc = await CompanyBilling.findOne({ companyRef }).lean();

    if (!billingDoc)
      return res.json({ success: true, invoices: [] });

    res.json({
      success: true,
      invoices: billingDoc.invoices || [],
    });
  } catch (err) {
    console.error("❌ GET /billing/list error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ 2️⃣ Add New Invoice
   /api/company/data/billing/add
------------------------------------------------------ */
router.post("/add", companyAuth, async (req, res) => {
  try {
    const {
      companyRef,
      invoiceNo,
      client,
      clientEmail,
      clientAddress,
      projectName,
      issueDate,
      dueDate,
      amount,
      paidAmount,
      paymentTerms,
      notes,
      description,
      status,
      bankDetails,
      generatedBy,
    } = req.body;

    if (!companyRef || !client || !invoiceNo || !issueDate || !dueDate || !amount)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    // Find or create company billing doc
    let billDoc = await CompanyBilling.findOne({ companyRef });
    if (!billDoc)
      billDoc = await CompanyBilling.create({ companyRef, invoices: [] });

    // Create new invoice entry
    const newInvoice = {
      invoiceNo,
      client,
      clientEmail,
      clientAddress,
      projectName,
      issueDate,
      dueDate,
      amount,
      paidAmount: paidAmount || 0,
      paymentTerms,
      notes,
      description,
      status: status || "Pending",
      bankDetails: bankDetails || {},
      generatedBy: generatedBy || "System",
    };

    billDoc.invoices.push(newInvoice);
    await billDoc.save();

    res.status(201).json({
      success: true,
      message: "✅ Invoice added successfully",
      invoice: billDoc.invoices[billDoc.invoices.length - 1],
    });
  } catch (err) {
    console.error("❌ POST /billing/add error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ 3️⃣ Get Single Invoice
   /api/company/data/billing/:companyRef/:invoiceId
------------------------------------------------------ */
router.get("/:companyRef/:invoiceId", companyAuth, async (req, res) => {
  try {
    const { companyRef, invoiceId } = req.params;
    const billDoc = await CompanyBilling.findOne({ companyRef }).lean();

    if (!billDoc)
      return res.status(404).json({ success: false, message: "Company billing not found" });

    const invoice = billDoc.invoices.find((i) => i._id.toString() === invoiceId);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, invoice });
  } catch (err) {
    console.error("❌ GET /billing/:id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ 4️⃣ Update Invoice
   /api/company/data/billing/:companyRef/:invoiceId
------------------------------------------------------ */
router.put("/:companyRef/:invoiceId", companyAuth, async (req, res) => {
  try {
    const { companyRef, invoiceId } = req.params;
    const updates = req.body;

    const billDoc = await CompanyBilling.findOne({ companyRef });
    if (!billDoc)
      return res.status(404).json({ success: false, message: "Company billing not found" });

    const invoice = billDoc.invoices.id(invoiceId);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    Object.assign(invoice, updates);
    invoice.balanceAmount = invoice.amount - invoice.paidAmount;
    await billDoc.save();

    res.json({ success: true, message: "✅ Invoice updated successfully", invoice });
  } catch (err) {
    console.error("❌ PUT /billing error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ 5️⃣ Delete Invoice
   /api/company/data/billing/:companyRef/:invoiceId
------------------------------------------------------ */
router.delete("/:companyRef/:invoiceId", companyAuth, async (req, res) => {
  try {
    const { companyRef, invoiceId } = req.params;
    const billDoc = await CompanyBilling.findOne({ companyRef });
    if (!billDoc)
      return res.status(404).json({ success: false, message: "Company billing not found" });

    const invoice = billDoc.invoices.id(invoiceId);
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    invoice.deleteOne();
    await billDoc.save();

    res.json({ success: true, message: "✅ Invoice deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /billing error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;
