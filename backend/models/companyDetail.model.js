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
  { _id: false }
);

// ----------------------
// Main Company Detail Schema
// ----------------------
const CompanyDetailSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    companyType: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    panNumber: { type: String, required: true, trim: true },
    gstNumber: { type: String, required: true, trim: true },
    cinNumber: { type: String, required: true, trim: true },
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

    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

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

// ----------------------
// Indexes
// ----------------------
CompanyDetailSchema.index({ companyName: "text" });
CompanyDetailSchema.index({ registrationNumber: 1 }, { unique: true });
CompanyDetailSchema.index({ panNumber: 1 }, { unique: true });
CompanyDetailSchema.index({ gstNumber: 1 }, { unique: true });
CompanyDetailSchema.index({ cinNumber: 1 }, { unique: true });
CompanyDetailSchema.index({ email: 1 }, { unique: true, sparse: true });

// ----------------------
// Export
// ----------------------
const CompanyDetail = mongoose.model("CompanyDetail", CompanyDetailSchema);
module.exports = {CompanyDetail};
