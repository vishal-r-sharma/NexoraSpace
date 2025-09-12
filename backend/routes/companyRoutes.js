// ./routes/CompanyRoutes.js
const express = require("express");
const router = express.Router();

// ensure every response from these routes has JSON content-type
router.use((req, res, next) => {
  // Force JSON content type for all responses from this router
  res.type("application/json; charset=utf-8");
  next();
});

// bcrypt fallback
let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch (e) {
  console.warn("bcrypt native not available, falling back to bcryptjs. Error:", e.message);
  bcrypt = require("bcryptjs");
}

// auth middleware
const authMiddleware = require("../middleware/authMiddleware");

// defensive model loading
let CompanyDetail = null;
try {
  CompanyDetail = require("../models/companyDetail.model");
} catch (e) {
  console.error("❌ Failed to load CompanyDetail model — check path/casing. Error:", e.message);
}

let CompanyDetailJoiSchema = null;
try {
  CompanyDetailJoiSchema = require("../validation/companyDetail.validation").CompanyDetailJoiSchema;
} catch (e) {
  console.warn("⚠️ CompanyDetailJoiSchema not loaded — POST /add will skip Joi validation. Error:", e.message);
}

const ALLOWED_FIELDS = [
  "companyName","companyType","registrationNumber","panNumber","gstNumber","cinNumber",
  "dateOfIncorporation","authorisedCapital","paidUpCapital","directors","mainBusinessActivity",
  "numberOfEmployees","description","registeredAddress","city","state","pincode","country",
  "email","phone","website","socialMedia","bankName","accountNumber","ifscCode","branch",
  "logoUrl","status","loginEmail","loginPassword","features"
];

function pickAllowed(payload) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) out[key] = payload[key];
  }
  return out;
}

function ensureModel(res) {
  if (!CompanyDetail) {
    res.status(500).json({ success: false, message: "Server misconfiguration: Company model not loaded. Check server logs." });
    return false;
  }
  return true;
}

/**
 * GET /all
 */
router.get("/all", authMiddleware, async (req, res) => {
  if (!ensureModel(res)) return;
  try {
    const companies = await CompanyDetail.find({})
      .select("companyName cinNumber registrationNumber status logoUrl")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, companies });
  } catch (err) {
    console.error("GET /company/all error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching companies", error: String(err.message || err) });
  }
});

/**
 * POST /add
 */
router.post("/add", async (req, res) => {
  if (!ensureModel(res)) return;
  try {
    if (CompanyDetailJoiSchema) {
      const { error, value } = CompanyDetailJoiSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ success: false, message: "Validation failed", details: error.details });
      }
      req.body = value;
    }

    const payload = pickAllowed(req.body);

    if (payload.loginPassword) {
      const salt = await bcrypt.genSalt(10);
      payload.loginPassword = await bcrypt.hash(String(payload.loginPassword), salt);
    }

    if (typeof payload.directors === "string") {
      payload.directors = payload.directors.split(",").map((d) => d.trim()).filter(Boolean);
    }

    const company = new CompanyDetail(payload);
    await company.save();

    const obj = company.toObject();
    if (obj.loginPassword) delete obj.loginPassword;
    return res.status(201).json({ success: true, company: obj });
  } catch (err) {
    console.error("POST /company/add error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate value", error: err.keyValue });
    }
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
});

/**
 * GET /:id
 */
router.get("/:id", authMiddleware, async (req, res) => {
  if (!ensureModel(res)) return;
  try {
    const { id } = req.params;
    const company = await CompanyDetail.findById(id).lean();
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    if (company.loginPassword) delete company.loginPassword;
    return res.json({ success: true, company });
  } catch (err) {
    console.error("GET /company/:id error:", err);
    if (err && (err.kind === "ObjectId" || err.name === "CastError")) {
      return res.status(400).json({ success: false, message: "Invalid company id" });
    }
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
});

/**
 * PUT /:id
 */
router.put("/:id", authMiddleware, async (req, res) => {
  if (!ensureModel(res)) return;
  try {
    const { id } = req.params;
    const payload = pickAllowed(req.body);

    if (payload.loginPassword) {
      const salt = await bcrypt.genSalt(10);
      payload.loginPassword = await bcrypt.hash(String(payload.loginPassword), salt);
    }

    if (typeof payload.directors === "string") {
      payload.directors = payload.directors.split(",").map((d) => d.trim()).filter(Boolean);
    }

    const updated = await CompanyDetail.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      context: "query",
    }).lean();

    if (!updated) return res.status(404).json({ success: false, message: "Company not found" });
    if (updated.loginPassword) delete updated.loginPassword;
    return res.json({ success: true, message: "Company updated", company: updated });
  } catch (err) {
    console.error("PUT /company/:id error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate key", detail: err.keyValue });
    }
    if (err && (err.kind === "ObjectId" || err.name === "CastError")) {
      return res.status(400).json({ success: false, message: "Invalid company id" });
    }
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
});

/**
 * DELETE /:id
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  if (!ensureModel(res)) return;
  try {
    const { id } = req.params;
    const doc = await CompanyDetail.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: "Company not found" });
    return res.json({ success: true, message: "Company deleted" });
  } catch (err) {
    console.error("DELETE /company/:id error:", err);
    if (err && (err.kind === "ObjectId" || err.name === "CastError")) {
      return res.status(400).json({ success: false, message: "Invalid company id" });
    }
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
});

module.exports = router;
