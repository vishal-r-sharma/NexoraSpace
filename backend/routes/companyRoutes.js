// ./routes/CompanyRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const authMiddleware = require("../middleware/authMiddleware");
const CompanyDetail = require("../models/companyDetail.model"); // adjust path if needed
// Joi schema used for creation validation
// Adjust path if your validation file lives elsewhere
const { CompanyDetailJoiSchema } = require("../validation/companyDetail.validation");

//
// Helper: pick allowed fields from payload
//
const ALLOWED_FIELDS = [
    "companyName", "companyType", "registrationNumber", "panNumber", "gstNumber", "cinNumber",
    "dateOfIncorporation", "authorisedCapital", "paidUpCapital", "directors", "mainBusinessActivity",
    "numberOfEmployees", "description", "registeredAddress", "city", "state", "pincode", "country",
    "email", "phone", "website", "socialMedia", "bankName", "accountNumber", "ifscCode", "branch",
    "logoUrl", "status", "loginEmail", "loginPassword", "features"
];

function pickAllowed(payload) {
    const out = {};
    for (const key of ALLOWED_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
            out[key] = payload[key];
        }
    }
    return out;
}

//
// GET /all
// Protected - returns a light list for dashboard
//
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const companies = await CompanyDetail.find({})
            .select("companyName cinNumber registrationNumber status logoUrl")
            .sort({ createdAt: -1 })
            .lean();
        res.json(companies);
    } catch (err) {
        console.error("GET /company/all error:", err);
        res.status(500).json({ message: "Server error fetching companies" });
    }
});

//
// POST /add
// Public (or protected depending on your flow). Here we validate using Joi then create.
// If you want only admins to add, add `authMiddleware` to this route.
//
router.post("/add", async (req, res) => {
    // Validate incoming payload using Joi schema (abortEarly: false to collect all errors)
    const { error, value } = CompanyDetailJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Validation failed", details: error.details });
    }

    try {
        // Hash password if present
        if (value.loginPassword) {
            const salt = await bcrypt.genSalt(10);
            value.loginPassword = await bcrypt.hash(String(value.loginPassword), salt);
        }

        const company = new CompanyDetail(value);
        await company.save();

        const obj = company.toObject();
        delete obj.loginPassword; // don't return password
        res.status(201).json(obj);
    } catch (err) {
        console.error("POST /company/add error:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate value", error: err.keyValue });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//
// GET /:id
// Get full company details (protected)
//
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const company = await CompanyDetail.findById(id).lean();
        if (!company) return res.status(404).json({ message: "Company not found" });
        // safe: don't leak loginPassword
        if (company.loginPassword) delete company.loginPassword;
        res.json(company);
    } catch (err) {
        console.error("GET /company/:id error:", err);
        // If invalid ObjectId, Mongoose may throw; return 400
        if (err.kind === "ObjectId" || err.name === "CastError") {
            return res.status(400).json({ message: "Invalid company id" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

//
// PUT /:id
// Update allowed fields (protected). Hashes password if provided.
//
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const payload = pickAllowed(req.body);

        // If loginPassword present, hash it before update
        if (payload.loginPassword) {
            const salt = await bcrypt.genSalt(10);
            payload.loginPassword = await bcrypt.hash(String(payload.loginPassword), salt);
        }

        // If directors comes as string (comma-separated) client may send string; convert to array
        if (typeof payload.directors === "string") {
            payload.directors = payload.directors.split(",").map((d) => d.trim()).filter(Boolean);
        }

        const updated = await CompanyDetail.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            context: "query",
        }).lean();

        if (!updated) return res.status(404).json({ message: "Company not found" });

        // don't send password back
        if (updated.loginPassword) delete updated.loginPassword;

        res.json({ message: "Company updated", company: updated });
    } catch (err) {
        console.error("PUT /company/:id error:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate key", detail: err.keyValue });
        }
        if (err.kind === "ObjectId" || err.name === "CastError") {
            return res.status(400).json({ message: "Invalid company id" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//
// DELETE /:id
// Remove company (protected)
//
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await CompanyDetail.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ message: "Company not found" });
        res.json({ message: "Company deleted" });
    } catch (err) {
        console.error("DELETE /company/:id error:", err);
        if (err.kind === "ObjectId" || err.name === "CastError") {
            return res.status(400).json({ message: "Invalid company id" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
