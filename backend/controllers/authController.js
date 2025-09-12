// controllers/authController.js
const SystemUserModule = require("../models/SystemUser");
const SystemUser = SystemUserModule.SystemUser || SystemUserModule;
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
// Build cookie options depending on environment and request
const cookieOptions = (req) => {
  const isProd = process.env.NODE_ENV === "production";

  // If you want the cookie to be accessible across subdomains (api. and root),
  // set domain to ".nexoraspace.vishalsharmadev.in". If you don't need that,
  // omit domain so cookie is scoped to the API host.
  const domain = isProd ? ".nexoraspace.vishalsharmadev.in" : undefined;

  return {
    httpOnly: true,
    secure:
      // if request is over HTTPS (proxy may set x-forwarded-proto) OR running in prod
      (req && (req.secure || req.headers["x-forwarded-proto"] === "https")) ||
      isProd,
    // IMPORTANT: for cross-site cookies (frontend origin != api origin) we need 'none'
    // In dev keep 'lax' to avoid issues on localhost without https
    sameSite: isProd ? "none" : "lax",
    domain,
    path: "/", // ensure cookie is sent on all paths
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
};

// --- controller methods ---
module.exports.registerSystem = async function (req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password } = value;

    const existing = await SystemUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Account already exists. Please login." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await SystemUser.create({
      name,
      email,
      password: hash,
    });

    const token = generateToken({ id: user._id, email: user.email });

    res.cookie("token", token, cookieOptions(req));

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
    const isProd = process.env.NODE_ENV === "production";
    // Clear cookie using the same attributes (domain/path/sameSite/secure)
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: isProd ? ".nexoraspace.vishalsharmadev.in" : undefined,
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
