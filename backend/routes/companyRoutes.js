const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

// bcrypt setup
let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch {
  bcrypt = require("bcryptjs");
}

// middleware
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Models import with fallback
let CompanyDetail, LoginData, Employee, Project, Billing, AIChat;
try {
  CompanyDetail = require("../models/companyDetail.model").CompanyDetail || require("../models/companyDetail.model");
  LoginData = require("../models/loginData.model").LoginData || require("../models/loginData.model");
  Employee = require("../models/employee.model").Employee || require("../models/employee.model");
  Project = require("../models/project.model").Project || require("../models/project.model");
  Billing = require("../models/billing.model").Billing || require("../models/billing.model");
  AIChat = require("../models/aiChat.model").AIChat || require("../models/aiChat.model");
  console.log("✅ All models loaded successfully.");
} catch (e) {
  console.error("❌ Error loading models:", e.message);
}

// Allowed fields
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
    res.status(500).json({ success: false, message: "Failed to fetch companies", error: err.message });
  }
});

router.post("/add", async (req, res) => {
  if (!ensureModel(res, CompanyDetail, "CompanyDetail")) return;

  let company;
  try {
    const payload = pickAllowed(req.body);

    // ✅ Hash password safely
    let hashedPassword = "";
    if (payload.loginPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(String(payload.loginPassword), salt);
    } else {
      hashedPassword = await bcrypt.hash("default@123", 10);
    }

    payload.loginPassword = hashedPassword;
    payload.loginEmail = payload.loginEmail || `admin@${(payload.companyName || "company").toLowerCase().replace(/\s+/g, "")}.com`;

    if (typeof payload.directors === "string") {
      payload.directors = payload.directors.split(",").map((d) => d.trim()).filter(Boolean);
    }

    /* 🏢 Step 1: Create Company */
    company = await CompanyDetail.create(payload);
    console.log("✅ CompanyDetail created:", company._id);

    /* 🔐 Step 2: Create LoginData */
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

    /* 👨‍💼 Step 3: Create Default Employee */
    const employee = await Employee.create({
      companyRef: company._id,
      name: "Default Admin",
      email: payload.loginEmail,
      position: "Company Admin",
      status: "Active",
      joiningDate: new Date(),
      project: "Initialization",
      documents: [],
    });
    console.log("✅ Employee created:", employee._id);

    /* 💳 Step 4: Create Initial Billing (with required fields fix) */
    const billing = await Billing.create({
      companyRef: company._id,
      client: payload.companyName || "Default Client",
      clientName: payload.companyName || "Default Client",
      invoiceNo: "INIT-" + Date.now(),
      invoiceNumber: "INIT-" + Date.now(), // keep both if schema uses either
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      amount: 0,
      status: "Pending",
      items: [],
      notes: "Initial billing setup for new company.",
    });
    console.log("✅ Billing created:", billing._id);


    /* 📂 Step 5: Create Default Project */
    const project = await Project.create({
      companyRef: company._id,
      name: "Initialization Project",
      client: payload.companyName || "Default Client",
      status: "Planning",
      startDate: new Date(),
      endDate: new Date(),
      teamRefs: [employee._id],
      billingRefs: [billing._id],
      description: "Default project setup on company creation.",
    });
    console.log("✅ Project created:", project._id);

    /* 🤖 Step 6: Create Default AI Chat */
    const aiChat = await AIChat.create({
      companyRef: company._id,
      projectRef: project._id,
      employeeRef: employee._id,
      billingRef: billing._id,
      loginRef: loginData._id,
      sessionId: "INIT-" + Date.now(),
      messages: [
        { sender: "ai", text: `👋 Welcome ${payload.companyName || "your company"}! AI assistant activated.` },
      ],
      topic: "Initialization",
      aiModelUsed: "GPT-5",
    });
    console.log("✅ AIChat created:", aiChat._id);

    /* 🔗 Step 7: Link IDs in CompanyDetail */
    company.loginRef = loginData._id;
    company.defaultEmployeeRef = employee._id;
    company.defaultProjectRef = project._id;
    company.defaultBillingRef = billing._id;
    company.defaultAIChatRef = aiChat._id;
    await company.save();

    const response = company.toObject();
    delete response.loginPassword;

    return res.status(201).json({
      success: true,
      message: "✅ Company and all linked collections created successfully.",
      company: response,
    });
  } catch (err) {
    console.error("❌ Error during company creation:", err);
    if (company?._id) {
      await Promise.all([
        LoginData.deleteMany({ companyRef: company._id }),
        Employee.deleteMany({ companyRef: company._id }),
        Billing.deleteMany({ companyRef: company._id }),
        Project.deleteMany({ companyRef: company._id }),
        AIChat.deleteMany({ companyRef: company._id }),
        CompanyDetail.findByIdAndDelete(company._id),
      ]);
    }

    res.status(500).json({
      success: false,
      message: "Server error creating company",
      error: err.message,
    });
  }
});


// ✅ GET /:id → Company + linked data
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyDetail.findById(id).lean();
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    const loginData = await LoginData.findOne({ companyRef: id }).lean();
    const employees = await Employee.find({ companyRef: id }).lean();
    const projects = await Project.find({ companyRef: id }).lean();
    const billing = await Billing.find({ companyRef: id }).lean();
    const aiChats = await AIChat.find({ companyRef: id }).lean();

    res.json({
      success: true,
      company,
      related: { loginData, employees, projects, billing, aiChats },
    });
  } catch (err) {
    console.error("GET /company/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to get company", error: err.message });
  }
});



// ✅ PUT /api/company/:id → Update company details
router.put("/:id", authMiddleware, async (req, res) => {
  if (!ensureModel(res, CompanyDetail, "CompanyDetail")) return;

  try {
    const { id } = req.params;
    const updates = pickAllowed(req.body);

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid company ID format" });
    }

    // Fetch existing company
    const company = await CompanyDetail.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Handle login password hashing if changed
    let hashedPassword;
    if (updates.loginPassword && updates.loginPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(updates.loginPassword, salt);
      updates.loginPassword = hashedPassword;
    } else {
      delete updates.loginPassword; // skip if empty
    }

    // If login email changed → update LoginData record too
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

    // Directors: ensure array type
    if (typeof updates.directors === "string") {
      updates.directors = updates.directors.split(",").map((d) => d.trim()).filter(Boolean);
    }

    // Features: keep safe defaults
    updates.features = {
      ...company.features.toObject(),
      ...(updates.features || {}),
    };

    // Apply updates to company
    Object.assign(company, updates);
    company.updatedAt = new Date();

    await company.save();

    const updated = company.toObject();
    delete updated.loginPassword;

    return res.json({
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



// ✅ DELETE /:id → Delete company + all linked docs
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const company = await CompanyDetail.findByIdAndDelete(id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    await Promise.all([
      LoginData.deleteMany({ companyRef: id }),
      Employee.deleteMany({ companyRef: id }),
      Project.deleteMany({ companyRef: id }),
      Billing.deleteMany({ companyRef: id }),
      AIChat.deleteMany({ companyRef: id }),
    ]);

    res.json({ success: true, message: "Company and all linked records deleted." });
  } catch (err) {
    console.error("DELETE /company/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to delete company", error: err.message });
  }
});

module.exports = router;
