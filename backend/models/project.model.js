// ./models/project.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Sub-schema: Project Documents
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
// Main Project Schema
// ----------------------
const ProjectSchema = new mongoose.Schema(
  {
    // 🔗 Linked References
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
    },
    billingRefs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Billing",
        default: [],
      },
    ],
    teamRefs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: [],
      },
    ],

    // 🧩 Core Project Info
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
    documents: { type: [DocumentSchema], default: [] },

    // 🧠 System Metadata
    progress: { type: Number, min: 0, max: 100, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "projects" }
);

// ----------------------
// Indexes
// ----------------------
ProjectSchema.index({ companyRef: 1 });
ProjectSchema.index({ name: 1, client: 1 }, { unique: false });

// ----------------------
// Hooks
// ----------------------
ProjectSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// ----------------------
// Joi Validation
// ----------------------
const validateProject = (data) => {
  const schema = Joi.object({
    companyRef: Joi.string().required(),
    billingRefs: Joi.array().items(Joi.string().optional()),
    teamRefs: Joi.array().items(Joi.string().optional()),
    name: Joi.string().required(),
    client: Joi.string().required(),
    manager: Joi.string().optional(),
    status: Joi.string()
      .valid("Planning", "Active", "Completed", "OnHold")
      .optional(),
    budget: Joi.string().optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    technology: Joi.string().optional(),
    team: Joi.array().items(Joi.string().optional()),
    description: Joi.string().optional(),
    documents: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        fileUrl: Joi.string().uri().required(),
      })
    ),
    progress: Joi.number().min(0).max(100).optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

// ----------------------
// Export
// ----------------------
const Project = mongoose.model("Project", ProjectSchema);
module.exports = { Project, validateProject };
