// ./models/employee.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Sub-schema for employee documents
// ----------------------
const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ----------------------
// Main Employee Schema
// ----------------------
const EmployeeSchema = new mongoose.Schema(
  {
    // 🔗 Linked References
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
    },
    loginRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoginData",
      required: false,
    },

    // 🧍 Employee Basic Info
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    position: { type: String, required: true, trim: true },
    project: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
    joiningDate: { type: Date, required: true },

    // 📄 Documents
    documents: { type: [DocumentSchema], default: [] },

    // ⚙️ Optional HR Fields
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    salary: { type: Number, default: 0 },
    address: { type: String, trim: true },

    // System Fields
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "employees" }
);

// ----------------------
// Indexes
// ----------------------
EmployeeSchema.index({ companyRef: 1 });
EmployeeSchema.index({ email: 1 }, { unique: true, sparse: true });

// ----------------------
// Hooks
// ----------------------
EmployeeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// ----------------------
// Joi Validation
// ----------------------
const validateEmployee = (data) => {
  const schema = Joi.object({
    companyRef: Joi.string().required(),
    loginRef: Joi.string().optional(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    position: Joi.string().required(),
    project: Joi.string().required(),
    status: Joi.string().valid("Active", "On Leave", "Inactive").optional(),
    joiningDate: Joi.date().required(),
    documents: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        fileUrl: Joi.string().uri().required(),
      })
    ),
    phone: Joi.string().optional(),
    department: Joi.string().optional(),
    salary: Joi.number().optional(),
    address: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

// ----------------------
// Export
// ----------------------
const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = { Employee, validateEmployee };
