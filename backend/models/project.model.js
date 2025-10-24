// ./models/project.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Sub-schema for each Project
// ----------------------
const ProjectSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    manager: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Planning", "Active", "Completed", "OnHold"],
      default: "Planning",
    },
    budget: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    technology: { type: String, trim: true },
    team: { type: [String], default: [] },
    description: { type: String, trim: true },
    documents: [
      {
        name: { type: String, required: true, trim: true },
        fileUrl: { type: String, required: true, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

// ----------------------
// Main Project Collection (One per company)
// ----------------------
const CompanyProjectSchema = new mongoose.Schema(
  {
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
      unique: true, // One doc per company
    },
    projects: { type: [ProjectSubSchema], default: [] },
  },
  { timestamps: true, collection: "projects" }
);

const CompanyProject = mongoose.model("CompanyProject", CompanyProjectSchema);
module.exports = { CompanyProject };
