// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const { LoginData } = require("../models/loginData.model");
const { CompanyDetail } = require("../models/companyDetail.model");

// Always JSON
router.use((_, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/**
 * ✅ GET /api/company/data/user/:userId/:companyId
 * Fetch specific user and company info
 */
router.get("/user/:userId/:companyId", async (req, res) => {
  try {
    const { userId, companyId } = req.params;

    const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidId(userId) || !isValidId(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User or Company ID" });
    }

    // 🔍 Find login data for this company
    const loginDoc = await LoginData.findOne({ companyRef: companyId }).lean();
    if (!loginDoc) {
      return res
        .status(404)
        .json({ success: false, message: "No login data found for this company" });
    }

    // 🔍 Find specific user
    const user = loginDoc.users.find((u) => String(u._id) === String(userId));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in this company" });
    }

    // 🔍 Get company basic info
    const company = await CompanyDetail.findById(companyId)
      .select("companyName logoUrl email phone status")
      .lean();

    return res.status(200).json({
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
      company: company || null,
    });
  } catch (err) {
    console.error("❌ Error fetching user/company data:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user/company info",
      error: err.message,
    });
  }
});



module.exports = router;
