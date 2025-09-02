const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    // Basic Information
    companyName: { type: String, required: true, trim: true },
    companyType: {
      type: String,
      enum: ["Private Limited", "Public Limited", "Partnership", "LLP", "Sole Proprietorship"],
      default: "Private Limited",
    },
    dateOfIncorporation: { type: Date },

    // Registration Details
    registrationNumber: { type: String },
    cinNumber: { type: String },
    panNumber: { type: String },
    gstNumber: { type: String },
    mainBusinessActivity: { type: String },

    // Financial & Management
    authorisedCapital: { type: String },
    paidUpCapital: { type: String },
    directors: { type: String }, // can store comma-separated
    numberOfEmployees: { type: Number },
    description: { type: String },

    // Registered Address
    registeredAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },

    // Admin Login
    loginEmail: { type: String, required: true, unique: true },
    loginPassword: { type: String, required: true },

    // Contact Information
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    socialMedia: { type: String },

    // Banking Details
    bankName: { type: String },
    branch: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },

    // Other Details
    logoUrl: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Features (boolean flags)
    features: {
      employeeManagement: { type: Boolean, default: false },
      projectManagement: { type: Boolean, default: false },
      billingSystem: { type: Boolean, default: false },
      inventoryManagement: { type: Boolean, default: false },
      crm: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      hrManagement: { type: Boolean, default: false },
      payrollSystem: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
