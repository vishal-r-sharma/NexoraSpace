// ./models/aiChat.model.js
const mongoose = require("mongoose");
const Joi = require("joi");

// ----------------------
// Sub-schema: Each chat message
// ----------------------
const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    text: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
      // optional AI metrics or NLP attributes
      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],
        default: "neutral",
      },
      aiConfidence: { type: Number, min: 0, max: 1 },
    },
  },
  { _id: false }
);

// ----------------------
// Main AI Chat Schema
// ----------------------
const AIChatSchema = new mongoose.Schema(
  {
    // 🔗 Linked References
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
    employeeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    billingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
      default: null,
    },
    loginRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoginData",
      default: null,
    },

    // 💬 Chat Session Info
    sessionId: { type: String, required: true, unique: true },
    topic: { type: String, default: "General", trim: true },
    context: { type: String, default: "Company AI Assistant", trim: true },
    messages: { type: [MessageSchema], default: [] },

    // 🧠 AI System Metadata
    aiModelUsed: { type: String, default: "GPT-5" },
    totalMessages: { type: Number, default: 0 },
    lastInteractionAt: { type: Date, default: Date.now },
    sentimentSummary: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    summaryNotes: { type: String, trim: true },

    // ⚙️ System Fields
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "aichats" }
);

// ----------------------
// Indexes
// ----------------------
AIChatSchema.index({ companyRef: 1 });
AIChatSchema.index({ sessionId: 1 }, { unique: true });
AIChatSchema.index({ lastInteractionAt: -1 });

// ----------------------
// Hooks
// ----------------------
AIChatSchema.pre("save", function (next) {
  this.totalMessages = this.messages.length;
  this.lastInteractionAt = new Date();
  next();
});

// ----------------------
// Joi Validation
// ----------------------
const validateAIChat = (data) => {
  const schema = Joi.object({
    companyRef: Joi.string().required(),
    projectRef: Joi.string().optional(),
    employeeRef: Joi.string().optional(),
    billingRef: Joi.string().optional(),
    loginRef: Joi.string().optional(),
    sessionId: Joi.string().required(),
    topic: Joi.string().optional(),
    context: Joi.string().optional(),
    messages: Joi.array().items(
      Joi.object({
        sender: Joi.string().valid("user", "ai").required(),
        text: Joi.string().required(),
        metadata: Joi.object({
          sentiment: Joi.string().valid("positive", "neutral", "negative").optional(),
          aiConfidence: Joi.number().min(0).max(1).optional(),
        }).optional(),
      })
    ),
    aiModelUsed: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

// ----------------------
// Export
// ----------------------
const AIChat = mongoose.model("AIChat", AIChatSchema);
module.exports = { AIChat, validateAIChat };
