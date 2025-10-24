const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Unified Models Import
const { CompanyDetail } = require("../models/companyDetail.model");
const { LoginData } = require("../models/loginData.model");
const { CompanyEmployee } = require("../models/employee.model");
const { CompanyProject } = require("../models/project.model");
const { CompanyBilling } = require("../models/billing.model");
const { CompanyAIChat } = require("../models/aiChat.model");

console.log("✅ All unified models loaded successfully.");

// ✅ Always respond JSON
router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

// ✅ Allowed fields for company creation/update
const ALLOWED_FIELDS = [
  "companyName", "companyType", "registrationNumber", "panNumber", "gstNumber",
  "cinNumber", "dateOfIncorporation", "authorisedCapital", "paidUpCapital",
  "directors", "mainBusinessActivity", "numberOfEmployees", "description",
  "registeredAddress", "city", "state", "pincode", "country", "email", "phone",
  "website", "socialMedia", "bankName", "accountNumber", "ifscCode", "branch",
  "logoUrl", "status", "loginEmail", "loginPassword", "features"
];

const pickAllowed = (obj) => {
  const out = {};
  for (const k of ALLOWED_FIELDS) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
};

// ✅ Ensure model loaded
const ensureModel = (res, model, name) => {
  if (!model) {
    res.status(500).json({ success: false, message: `${name} model not loaded properly` });
    return false;
  }
  return true;
};

// ✅ GET all companies
router.get("/all", authMiddleware, async (req, res) => {
  if (!ensureModel(res, CompanyDetail)) return;
  try {
    const companies = await CompanyDetail.find({})
      .select("companyName registrationNumber cinNumber status logoUrl createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, companies });
  } catch (err) {
    console.error("GET /company/all error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
      error: err.message,
    });
  }
});

// ✅ ADD new company (with unified embedded structure)
router.post("/add", async (req, res) => {
  if (!ensureModel(res, CompanyDetail, "CompanyDetail")) return;

  let company;
  try {
    const payload = pickAllowed(req.body);

    // Hash password
    const hashedPassword = await bcrypt.hash(
      payload.loginPassword || "default@123",
      10
    );

    payload.loginPassword = hashedPassword;
    payload.loginEmail =
      payload.loginEmail ||
      `admin@${(payload.companyName || "company")
        .toLowerCase()
        .replace(/\s+/g, "")}.com`;

    if (typeof payload.directors === "string") {
      payload.directors = payload.directors
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    }

    // 🏢 Step 1: Create Company
    company = await CompanyDetail.create(payload);
    console.log("✅ CompanyDetail created:", company._id);

    // 🔐 Step 2: Create LoginData
    const loginData = await LoginData.create({
      companyRef: company._id,
      users: [
        {
          role: "Admin",
          email: payload.loginEmail,
          password: hashedPassword,
          name: `${payload.companyName || "Admin"} Owner`,
        },
      ],
    });
    console.log("✅ LoginData created:", loginData._id);

    // 👨‍💼 Step 3: Add Default Employee
    let empDoc = await CompanyEmployee.findOne({ companyRef: company._id });
    if (!empDoc)
      empDoc = await CompanyEmployee.create({
        companyRef: company._id,
        employees: [],
      });

    empDoc.employees.push({
      name: "Default Admin",
      email: payload.loginEmail,
      position: "Company Admin",
      status: "Active",
      joiningDate: new Date(),
      project: "Initialization",
      documents: [],
    });

    await empDoc.save();
    const employee = empDoc.employees[empDoc.employees.length - 1];
    console.log("✅ Employee added:", employee._id);

    // 💳 Step 4: Add Default Billing
    let billDoc = await CompanyBilling.findOne({ companyRef: company._id });
    if (!billDoc)
      billDoc = await CompanyBilling.create({
        companyRef: company._id,
        invoices: [],
      });

    billDoc.invoices.push({
      invoiceNo: "INIT-" + Date.now(),
      client: payload.companyName || "Default Client",
      clientEmail: payload.email,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      amount: 0,
      paidAmount: 0,
      notes: "Initial billing setup for new company.",
      status: "Pending",
    });

    await billDoc.save();
    const billing = billDoc.invoices[billDoc.invoices.length - 1];
    console.log("✅ Billing added:", billing._id);

    // 📂 Step 5: Add Default Project
    let projectDoc = await CompanyProject.findOne({ companyRef: company._id });
    if (!projectDoc)
      projectDoc = await CompanyProject.create({
        companyRef: company._id,
        projects: [],
      });

    projectDoc.projects.push({
      name: "Initialization Project",
      client: payload.companyName || "Default Client",
      manager: "Default Admin",
      status: "Planning",
      startDate: new Date(),
      endDate: new Date(),
      team: [employee.name],
      description: "Default project setup on company creation.",
      budget: "0",
    });

    await projectDoc.save();
    const project = projectDoc.projects[projectDoc.projects.length - 1];
    console.log("✅ Project added:", project._id);

    // 🤖 Step 6: Add Default AI Chat
    let chatDoc = await CompanyAIChat.findOne({ companyRef: company._id });
    if (!chatDoc)
      chatDoc = await CompanyAIChat.create({
        companyRef: company._id,
        chats: [],
      });

    chatDoc.chats.push({
      sessionId: "INIT-" + Date.now(),
      topic: "Initialization",
      messages: [
        {
          sender: "ai",
          text: `👋 Welcome ${payload.companyName || "your company"}! AI assistant activated.`,
        },
      ],
      aiModelUsed: "GPT-5",
    });

    await chatDoc.save();
    const aiChat = chatDoc.chats[chatDoc.chats.length - 1];
    console.log("✅ AI Chat added:", aiChat._id);

    // 🔗 Step 7: Link IDs in CompanyDetail
    company.loginRef = loginData._id;
    await company.save();

    const response = company.toObject();
    delete response.loginPassword;

    res.status(201).json({
      success: true,
      message: "✅ Company and all embedded collections created successfully.",
      company: response,
    });
  } catch (err) {
    console.error("❌ Error during company creation:", err);
    if (company?._id) {
      await Promise.all([
        LoginData.deleteMany({ companyRef: company._id }),
        CompanyEmployee.deleteMany({ companyRef: company._id }),
        CompanyBilling.deleteMany({ companyRef: company._id }),
        CompanyProject.deleteMany({ companyRef: company._id }),
        CompanyAIChat.deleteMany({ companyRef: company._id }),
        CompanyDetail.findByIdAndDelete(company._id),
      ]);
    }
    res.status(500).json({
      success: false,
      message: "Server error creating company",
      error: err.stack,
    });
  }
});

// ✅ GET /:id → Company + linked data
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyDetail.findById(id).lean();
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    const loginData = await LoginData.findOne({ companyRef: id }).lean();
    const employees = await CompanyEmployee.findOne({ companyRef: id }).lean();
    const projects = await CompanyProject.findOne({ companyRef: id }).lean();
    const billing = await CompanyBilling.findOne({ companyRef: id }).lean();
    const aiChats = await CompanyAIChat.findOne({ companyRef: id }).lean();

    res.json({
      success: true,
      company,
      related: { loginData, employees, projects, billing, aiChats },
    });
  } catch (err) {
    console.error("GET /company/:id error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get company",
      error: err.message,
    });
  }
});

// ✅ PUT /api/company/:id → Update company details
router.put("/:id", authMiddleware, async (req, res) => {
  if (!ensureModel(res, CompanyDetail, "CompanyDetail")) return;

  try {
    const { id } = req.params;
    const updates = pickAllowed(req.body);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid company ID" });
    }

    const company = await CompanyDetail.findById(id);
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    let hashedPassword;
    if (updates.loginPassword && updates.loginPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(updates.loginPassword, salt);
      updates.loginPassword = hashedPassword;
    } else {
      delete updates.loginPassword;
    }

    if (updates.loginEmail) {
      const loginData = await LoginData.findOne({ companyRef: id });
      if (loginData) {
        const adminUser = loginData.users.find((u) => u.role === "Admin");
        if (adminUser) {
          adminUser.email = updates.loginEmail;
          if (hashedPassword) adminUser.password = hashedPassword;
        }
        loginData.lastUpdated = new Date();
        await loginData.save();
      }
    }

    if (typeof updates.directors === "string") {
      updates.directors = updates.directors
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    }

    updates.features = {
      ...company.features.toObject(),
      ...(updates.features || {}),
    };

    Object.assign(company, updates);
    company.updatedAt = new Date();
    await company.save();

    const updated = company.toObject();
    delete updated.loginPassword;

    res.json({
      success: true,
      message: "Company updated successfully.",
      company: updated,
    });
  } catch (err) {
    console.error("PUT /company/:id error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update company",
      error: err.message,
    });
  }
});

// ✅ DELETE company + linked data
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyDetail.findByIdAndDelete(id);
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    await Promise.all([
      LoginData.deleteMany({ companyRef: id }),
      CompanyEmployee.deleteMany({ companyRef: id }),
      CompanyProject.deleteMany({ companyRef: id }),
      CompanyBilling.deleteMany({ companyRef: id }),
      CompanyAIChat.deleteMany({ companyRef: id }),
    ]);

    res.json({
      success: true,
      message: "Company and all linked records deleted.",
    });
  } catch (err) {
    console.error("DELETE /company/:id error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
      error: err.message,
    });
  }
});

module.exports = router;
