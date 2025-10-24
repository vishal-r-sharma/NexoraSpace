const mongoose = require("mongoose");

// ----------------------
// Sub-schema for features toggle
// ----------------------
const FeaturesSchema = new mongoose.Schema(
  {
    employeeManagement: { type: Boolean, default: false },
    projectManagement: { type: Boolean, default: false },
    billingSystem: { type: Boolean, default: false },
    aiAssistant: { type: Boolean, default: false },
  },
);

// ----------------------
// Main Company Detail Schema (NO INDEXING)
// ----------------------
const CompanyDetailSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    companyType: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true }, // ✅ no unique
    panNumber: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    cinNumber: { type: String, trim: true },
    dateOfIncorporation: { type: Date, required: true },
    authorisedCapital: { type: Number, required: true },
    paidUpCapital: { type: Number, required: true },
    directors: [{ type: String, trim: true }],
    mainBusinessActivity: { type: String, required: true, trim: true },
    numberOfEmployees: { type: Number, default: 0 },

    description: { type: String, trim: true },
    registeredAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },

    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    website: { type: String, trim: true },
    socialMedia: { type: String, trim: true },

    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    branch: { type: String, trim: true },

    logoUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // ✅ Login fields
    loginEmail: { type: String, trim: true, lowercase: true, default: null },
    loginPassword: { type: String, trim: true, default: null },

    // 🔗 Relations
    loginDataRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoginData",
      default: null,
    },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    billings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Billing" }],
    aiChats: [{ type: mongoose.Schema.Types.ObjectId, ref: "AIChat" }],

    features: { type: FeaturesSchema, default: () => ({}) },
  },
  { timestamps: true, collection: "companydetails" }
);

// ❌ REMOVE ALL INDEXES — make sure no index is created
CompanyDetailSchema.set("autoIndex", false);

// ----------------------
// Export
// ----------------------
const CompanyDetail = mongoose.model("CompanyDetail", CompanyDetailSchema);
module.exports = { CompanyDetail };
