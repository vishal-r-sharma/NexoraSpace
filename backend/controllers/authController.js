// controllers/authController.js
const SystemUserModule = require("../models/SystemUser");
const SystemUser = SystemUserModule.SystemUser || SystemUserModule; // support both exports
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const Joi = require("joi");



// --- Joi Schemas ---
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});



// --- helpers ---
const cookieOptions = (req) => ({
  httpOnly: true,
  secure: req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});



// --- controller methods ---
module.exports.registerSystem = async function (req, res) {
  try {
    // validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password } = value;

    // check existing user
    const existing = await SystemUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Account already exists. Please login." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user
    const user = await SystemUser.create({
      name,
      email,
      password: hash,
    });

    // create token (store relevant payload)
    const token = generateToken({ id: user._id, email: user.email });

    // set cookie
    res.cookie("token", token, cookieOptions(req));

    // send minimal user info (never send password)
    res.status(201).json({
      message: "System User created",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("registerSystem error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports.login = async function (req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = value;

    const user = await SystemUser.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password." });

    const token = generateToken({ id: user._id, email: user.email });

    res.cookie("token", token, cookieOptions(req));

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports.logout = function (req, res) {
  try {
    // Clear cookie. Use same options so cookie is actually removed in some browsers
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
