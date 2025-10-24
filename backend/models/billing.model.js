// ./models/billing.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Main Billing / Invoice Schema
// ----------------------
const BillingSchema = new mongoose.Schema(
  {
    // 🔗 Relations
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
    },
    projectRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // 🧾 Invoice Info
    invoiceNo: { type: String, required: true, unique: true, trim: true },
    client: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    clientAddress: { type: String, trim: true },
    projectName: { type: String, trim: true },

    // 📅 Dates
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    // 💰 Financials
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    paymentTerms: { type: String, trim: true },
    notes: { type: String, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue", "Partial"],
      default: "Pending",
    },

    // 🏦 Banking Summary
    bankDetails: {
      bankName: { type: String, trim: true },
      branch: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
    },

    // 📈 Auto Calculated
    balanceAmount: {
      type: Number,
      default: function () {
        return this.amount - this.paidAmount;
      },
    },

    // 🔒 System fields
    generatedBy: { type: String, trim: true }, // who created the invoice
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "billings" }
);

// ----------------------
// Hooks
// ----------------------
BillingSchema.pre("save", function (next) {
  this.balanceAmount = this.amount - this.paidAmount;
  if (this.balanceAmount <= 0) this.status = "Paid";
  else if (this.paidAmount > 0 && this.paidAmount < this.amount)
    this.status = "Partial";
  else if (new Date(this.dueDate) < new Date() && this.paidAmount < this.amount)
    this.status = "Overdue";
  else this.status = "Pending";
  next();
});

// ----------------------
// Indexes
// ----------------------
BillingSchema.index({ companyRef: 1 });
BillingSchema.index({ projectRef: 1 });
BillingSchema.index({ invoiceNo: 1 }, { unique: true });

// ----------------------
// Joi Validation
// ----------------------
const validateBilling = (data) => {
  const schema = Joi.object({
    companyRef: Joi.string().required(),
    projectRef: Joi.string().optional(),
    invoiceNo: Joi.string().required(),
    client: Joi.string().required(),
    clientEmail: Joi.string().email().optional(),
    clientAddress: Joi.string().optional(),
    projectName: Joi.string().optional(),
    issueDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    amount: Joi.number().required().min(0),
    paidAmount: Joi.number().min(0).optional(),
    paymentTerms: Joi.string().optional(),
    notes: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string()
      .valid("Paid", "Pending", "Overdue", "Partial")
      .optional(),
    bankDetails: Joi.object({
      bankName: Joi.string().optional(),
      branch: Joi.string().optional(),
      accountNumber: Joi.string().optional(),
      ifscCode: Joi.string().optional(),
    }).optional(),
    generatedBy: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

// ----------------------
// Export
// ----------------------
const Billing = mongoose.model("Billing", BillingSchema);
module.exports = { Billing, validateBilling };
