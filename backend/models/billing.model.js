// ./models/billing.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

const InvoiceSubSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    clientAddress: { type: String, trim: true },
    projectName: { type: String, trim: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
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
    bankDetails: {
      bankName: { type: String, trim: true },
      branch: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
    },
    generatedBy: { type: String, trim: true },
    balanceAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

InvoiceSubSchema.pre("save", function (next) {
  this.balanceAmount = this.amount - this.paidAmount;
  next();
});

const CompanyBillingSchema = new mongoose.Schema(
  {
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
      unique: true,
    },
    invoices: { type: [InvoiceSubSchema], default: [] },
  },
  { timestamps: true, collection: "billings" }
);

const CompanyBilling = mongoose.model("CompanyBilling", CompanyBillingSchema);
module.exports = { CompanyBilling };
