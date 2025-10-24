// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const companyAuth = require("../middleware/companyAuth");

// 🔐 Company Login
router.post("/login", login);

// 🚪 Logout
router.post("/logout", logout);

// 🛡️ Check company token validity
router.get("/check", companyAuth, (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: req.user || req.companyUser, // unified
  });
});

module.exports = router;
