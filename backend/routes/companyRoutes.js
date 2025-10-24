// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const { LoginData } = require("../models/loginData.model");
const { CompanyDetail } = require("../models/companyDetail.model");
const companyAuth = require("../middleware/companyAuth");

// Always JSON
router.use((_, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/* ------------------------------------------------------
   ✅ 1️⃣ Check Logged-in Company Info
   /api/company/data/check
------------------------------------------------------ */
router.get("/check", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    if (!companyRef)
      return res
        .status(400)
        .json({ success: false, message: "Missing company reference" });

    const company = await CompanyDetail.findById(companyRef)
      .select("-loginPassword")
      .lean();

    if (!company)
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });

    res.json({
      success: true,
      message: "Company verified successfully",
      company,
    });
  } catch (err) {
    console.error("❌ /check route error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

/* ------------------------------------------------------
   ✅ 2️⃣ Fetch specific user + full company data
   /api/company/data/user/:userId/:companyId
------------------------------------------------------ */
router.get("/user/:userId/:companyId", async (req, res) => {
  try {
    const { userId, companyId } = req.params;

    const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidId(userId) || !isValidId(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User or Company ID" });
    }

    const loginDoc = await LoginData.findOne({ companyRef: companyId }).lean();
    if (!loginDoc)
      return res
        .status(404)
        .json({ success: false, message: "No login data found for this company" });

    const user = loginDoc.users.find((u) => String(u._id) === String(userId));
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found in this company" });

    // ✅ Full company info for PDF + dashboard
    const company = await CompanyDetail.findById(companyId)
      .select(
        "companyName logoUrl email phone status registeredAddress city state pincode country bankName branch accountNumber ifscCode gstNumber panNumber cinNumber"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "User and company data fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        companyRef: companyId,
      },
      company: company || {},
    });
  } catch (err) {
    console.error("❌ Error fetching user/company data:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching company info",
      error: err.message,
    });
  }
});

module.exports = router;
