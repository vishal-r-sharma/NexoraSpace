const express = require("express");
const router = express.Router();
const companyAuth = require("../middleware/companyAuth");
const { askProjectQuestion } = require("../services/rag.service");
const { CompanyAIChat } = require("../models/aiChat.model");

router.post("/project/send", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser.companyRef;
    const { text, sessionId, projectId } = req.body;

    if (!projectId)
      return res.status(400).json({ success: false, message: "Select project" });

    let chatDoc = await CompanyAIChat.findOne({ companyRef });
    if (!chatDoc) chatDoc = new CompanyAIChat({ companyRef, chats: [] });

    let chat = chatDoc.chats.find((c) => c.sessionId === sessionId);

    if (!chat) {
      chatDoc.chats.push({ sessionId, topic: "Project AI", messages: [] });
      chat = chatDoc.chats[chatDoc.chats.length - 1];
    }

    chat.messages.push({ sender: "user", text });

    const aiReply = await askProjectQuestion({
      companyRef,
      projectId,
      question: text,
      chatHistory: chat.messages,
    });

    chat.messages.push({ sender: "ai", text: aiReply });

    await chatDoc.save();

    res.json({ success: true, response: aiReply, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;