// middleware/companyAuth.js
const jwt = require("jsonwebtoken");
const { LoginData } = require("../models/loginData.model");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_company_key";

/**
 * Middleware for verifying company dashboard token (Admin, Manager, Employee)
 */
module.exports = async function companyAuth(req, res, next) {
  try {
    const token =
      req.cookies?.companytoken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No company token provided",
      });
    }

    // Decode JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.userId || !decoded?.companyRef) {
      return res.status(401).json({
        success: false,
        message: "Invalid company token payload",
      });
    }

    // Verify user exists in LoginData
    const loginDoc = await LoginData.findOne({
      companyRef: decoded.companyRef,
      "users._id": decoded.userId,
    }).lean();

    if (!loginDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication record",
      });
    }

    const userObj = loginDoc.users.find(
      (u) => u._id.toString() === decoded.userId.toString()
    );

    if (!userObj) {
      return res.status(401).json({
        success: false,
        message: "User not found in LoginData",
      });
    }

    // ✅ Attach to req
    req.companyUser = {
      _id: userObj._id,
      email: userObj.email,
      role: userObj.role,
      companyRef: decoded.companyRef,
    };

    // ✅ For frontend check route compatibility
    req.user = req.companyUser;

    next();
  } catch (err) {
    console.error("❌ companyAuth error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired company token",
    });
  }
};
