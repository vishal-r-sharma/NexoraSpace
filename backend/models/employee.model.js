// ./models/employee.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Sub-schema for Employee Documents
// ----------------------
const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true, trim: true },
  uploadedAt: { type: Date, default: Date.now },
});


// ----------------------
// Sub-schema for Individual Employee
// ----------------------
const EmployeeSubSchema = new mongoose.Schema(
  {
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
    documents: { type: [DocumentSchema], default: [] },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    salary: { type: Number, default: 0 },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

// ----------------------
// Main Schema: one doc per company
// ----------------------
const CompanyEmployeeSchema = new mongoose.Schema(
  {
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
      unique: true, // ✅ ensures one company → one document
    },
    employees: { type: [EmployeeSubSchema], default: [] },
  },
  { timestamps: true, collection: "employees" }
);

// ----------------------
// Validation Schema
// ----------------------
const validateCompanyEmployees = (data) => {
  const employeeSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    position: Joi.string().required(),
    project: Joi.string().required(),
    status: Joi.string().valid("Active", "On Leave", "Inactive").optional(),
    joiningDate: Joi.date().required(),
    phone: Joi.string().optional(),
    department: Joi.string().optional(),
    salary: Joi.number().optional(),
    address: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    documents: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        fileUrl: Joi.string().uri().required(),
      })
    ),
  });

  return Joi.object({
    companyRef: Joi.string().required(),
    employees: Joi.array().items(employeeSchema).optional(),
  }).validate(data);
};

const CompanyEmployee = mongoose.model("CompanyEmployee", CompanyEmployeeSchema);
module.exports = { CompanyEmployee, validateCompanyEmployees };
