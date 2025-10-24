// routes/systemAuthRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Import SystemUser model & Joi validator
const { SystemUser, validateSystemUser } = require("../models/SystemUser");

// ✅ Always JSON
router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/**
 * 🆕 POST /api/auth/systemauth/register
 * Public registration for new System Admin
 */
router.post("/register", async (req, res) => {
  try {
    // ✅ Validate input with Joi
    const { error } = validateSystemUser(req.body);
    if (error)
      return res.status(400).json({ success: false, error: error.details[0].message });

    const { name, email, password } = req.body;

    // ✅ Check duplicate email
    const existing = await SystemUser.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, error: "Email already registered" });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // ✅ Save user to DB
    const newUser = await SystemUser.create({
      name,
      email,
      password: hashed,
    });

    // 🪙 Auto-login after registration (optional)
    const token = jwt.sign(
      { id: newUser._id, role: "SystemAdmin", email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // 🍪 Set cookie
    res.cookie("systemtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    return res.status(201).json({
      success: true,
      message: "System admin registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: "SystemAdmin",
      },
    });
  } catch (err) {
    console.error("❌ System Register Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while registering system admin",
      details: err.message,
    });
  }
});

/**
 * 🔐 POST /api/auth/systemauth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Email and password required" });

    // ✅ Find user
    const systemUser = await SystemUser.findOne({ email });
    if (!systemUser)
      return res.status(401).json({ success: false, error: "Invalid credentials" });

    // ✅ Compare password
    const validPass = await bcrypt.compare(password, systemUser.password);
    if (!validPass)
      return res.status(401).json({ success: false, error: "Invalid credentials" });

    // 🪙 Generate token
    const token = jwt.sign(
      {
        id: systemUser._id,
        role: "SystemAdmin",
        email: systemUser.email,
        name: systemUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // 🍪 Set cookie
    res.cookie("systemtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "System Admin login successful",
      token,
      user: {
        id: systemUser._id,
        email: systemUser.email,
        name: systemUser.name,
        role: "SystemAdmin",
      },
    });
  } catch (err) {
    console.error("❌ System Login Error:", err);
    res.status(500).json({ success: false, error: "Server error during login" });
  }
});

/**
 * 🚪 POST /api/auth/systemauth/logout
 */
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("systemtoken", {
      path: "/", // ✅ Must match original cookie scope
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    console.log("✅ Systemtoken cookie cleared successfully");

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    res.status(500).json({ success: false, error: "Error clearing cookie" });
  }
});


/**
 * 🔍 GET /api/auth/systemauth/check
 */
router.get("/check", authMiddleware, (req, res) => {
  try {
    const token = req.cookies?.systemtoken;
    if (!token)
      return res.status(401).json({ authenticated: false, error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "SystemAdmin")
      return res.status(403).json({ authenticated: false, error: "Unauthorized role" });

    res.status(200).json({
      authenticated: true,
      user: decoded,
    });
  } catch (err) {
    res.status(401).json({ authenticated: false, error: "Invalid or expired token" });
  }
});

module.exports = router;
