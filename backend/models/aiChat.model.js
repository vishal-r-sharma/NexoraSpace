// ./models/aiChat.model.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
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

const ChatSubSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, trim: true },
    topic: { type: String, default: "General", trim: true },
    context: { type: String, default: "Company AI Assistant", trim: true },
    messages: { type: [MessageSchema], default: [] },
    aiModelUsed: { type: String, default: "GPT-5" },
    totalMessages: { type: Number, default: 0 },
    lastInteractionAt: { type: Date, default: Date.now },
    sentimentSummary: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    summaryNotes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

ChatSubSchema.pre("save", function (next) {
  this.totalMessages = this.messages.length;
  this.lastInteractionAt = new Date();
  next();
});

const CompanyAIChatSchema = new mongoose.Schema(
  {
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
      unique: true,
    },
    chats: { type: [ChatSubSchema], default: [] },
  },
  { timestamps: true, collection: "aichats" }
);

const CompanyAIChat = mongoose.model("CompanyAIChat", CompanyAIChatSchema);
module.exports = { CompanyAIChat };
