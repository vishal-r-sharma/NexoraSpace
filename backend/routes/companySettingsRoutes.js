const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const companyAuth = require("../middleware/companyAuth");
const { CompanyDetail } = require("../models/companyDetail.model");
const { LoginData } = require("../models/loginData.model");

/* ------------------------------------------------------
   ✅ Update Company Settings
   PATCH /api/company/data/settings/update
------------------------------------------------------ */
router.patch("/update", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    if (!companyRef)
      return res.status(400).json({ success: false, message: "Missing companyRef" });

    const company = await CompanyDetail.findById(companyRef);
    if (!company)
      return res.status(404).json({ success: false, message: "Company not found" });

    const updates = req.body || {};
    let loginUpdated = false;

    const allowedCompanyFields = [
      "companyName",
      "companyType",
      "email",
      "phone",
      "website",
      "bankName",
      "accountNumber",
      "ifscCode",
      "loginEmail",
      "loginPassword",
    ];

    allowedCompanyFields.forEach((key) => {
      if (updates[key] !== undefined) company[key] = updates[key];
    });

    // 👤 Update Admin info (email, name, password)
    if (updates.loginEmail || updates.loginPassword || updates.userName) {
      const loginData = await LoginData.findOne({ companyRef });
      if (loginData) {
        const admin = loginData.users.find((u) => u.role === "Admin");
        if (admin) {
          if (updates.loginEmail) admin.email = updates.loginEmail;
          if (updates.userName) admin.name = updates.userName;
          if (updates.loginPassword && updates.loginPassword.trim() !== "") {
            const hashed = await bcrypt.hash(updates.loginPassword, 10);
            admin.password = hashed;
            company.loginPassword = hashed;
          }
          loginData.lastUpdated = new Date();
          await loginData.save();
          loginUpdated = true;
        }
      }
    }

    await company.save();

    res.json({
      success: true,
      message: loginUpdated
        ? "Company and Admin profile updated successfully."
        : "Company details updated successfully.",
      company,
    });
  } catch (err) {
    console.error("❌ PATCH /settings/update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ Check Company Data (GET /check)
   Shows only 4 Feature flags: employees, projects, billings, aiChats
------------------------------------------------------ */
router.get("/check", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    if (!companyRef)
      return res.status(400).json({ success: false, message: "Missing companyRef" });

    const company = await CompanyDetail.findById(companyRef).lean();
    if (!company)
      return res.status(404).json({ success: false, message: "Company not found" });

    const loginData = await LoginData.findOne({ companyRef }).lean();
    const admin = loginData?.users?.find((u) => u.role === "Admin");

    // Limit features to required 4 only
    const features = {
      employees: !!company.employees?.length,
      projects: !!company.projects?.length,
      billings: !!company.billings?.length,
      aiChats: !!company.aiChats?.length,
    };

    res.json({
      success: true,
      company: {
        companyName: company.companyName,
        companyType: company.companyType,
        email: company.email,
        phone: company.phone,
        website: company.website,
        bankName: company.bankName,
        accountNumber: company.accountNumber,
        ifscCode: company.ifscCode,
        loginEmail: company.loginEmail,
        userName: admin?.name || "",
        features,
      },
    });
  } catch (err) {
    console.error("❌ /check route error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
