const express = require("express");
const router = express.Router();
const { CompanyAIChat } = require("../models/aiChat.model");
const companyAuth = require("../middleware/companyAuth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* --------------------------------------------------------
   ✅ Get list of chat sessions (summary)
-------------------------------------------------------- */
router.get("/history", companyAuth, async (req, res) => {
    try {
        const companyRef = req.companyUser?.companyRef;
        if (!companyRef)
            return res.status(400).json({ success: false, message: "Missing companyRef" });

        const doc = await CompanyAIChat.findOne({ companyRef }).lean();
        if (!doc) return res.json({ success: true, chats: [] });

        const summaries = doc.chats
            .map((c) => ({
                sessionId: c.sessionId,
                totalMessages: c.messages.length,
                lastInteractionAt: c.lastInteractionAt,
                topic: c.topic,
            }))
            .sort((a, b) => new Date(b.lastInteractionAt) - new Date(a.lastInteractionAt));


        res.json({ success: true, chats: summaries });
    } catch (err) {
        console.error("❌ Error fetching chat history:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/* --------------------------------------------------------
   ✅ Get full chat by sessionId
-------------------------------------------------------- */
router.get("/history/:sessionId", companyAuth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const companyRef = req.companyUser?.companyRef;

        const doc = await CompanyAIChat.findOne({ companyRef });
        if (!doc) return res.json({ success: false, message: "No chats found" });

        const session = doc.chats.find((c) => c.sessionId === sessionId);
        if (!session)
            return res.json({ success: false, message: "Session not found" });

        res.json({ success: true, chat: session });
    } catch (err) {
        console.error("❌ Error fetching session chat:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/* --------------------------------------------------------
   ✅ Delete full chat session
-------------------------------------------------------- */
router.delete("/history/:sessionId", companyAuth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const companyRef = req.companyUser?.companyRef;

        const updated = await CompanyAIChat.findOneAndUpdate(
            { companyRef },
            { $pull: { chats: { sessionId } } },
            { new: true }
        );

        if (!updated) {
            return res.json({
                success: false,
                message: "Session not found or already deleted",
            });
        }

        res.json({ success: true, message: "Session deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting session:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/* --------------------------------------------------------
   ✅ Send message → Gemini → Save to DB
-------------------------------------------------------- */
router.post("/send", companyAuth, async (req, res) => {
    try {
        const companyRef = req.companyUser?.companyRef;
        const { text, sessionId } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({ success: false, message: "Message text required." });
        }

        let companyChat = await CompanyAIChat.findOne({ companyRef });
        if (!companyChat) {
            companyChat = new CompanyAIChat({ companyRef, chats: [] });
        }

        // Find or create chat session
        let chatIndex = companyChat.chats.findIndex((c) => c.sessionId === sessionId);
        if (chatIndex === -1) {
            companyChat.chats.push({
                sessionId,
                topic: "General",
                messages: [],
            });
            chatIndex = companyChat.chats.length - 1;
        }

        // Add user message
        companyChat.chats[chatIndex].messages.push({
            sender: "user",
            text,
            timestamp: new Date(),
        });

        // 🧠 Gemini AI Response
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const prompt = `
You are Nexora AI Assistant. Be professional and concise.
User message: ${text}
`;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text() || "I'm here to assist you.";

        // Add AI reply
        companyChat.chats[chatIndex].messages.push({
            sender: "ai",
            text: aiText,
            timestamp: new Date(),
        });


        companyChat.markModified("chats");
        await companyChat.save();

        res.json({
            success: true,
            response: aiText,
            sessionId: companyChat.chats[chatIndex].sessionId,
        });
    } catch (err) {
        console.error("❌ Gemini Chat error:", err);
        res.status(500).json({ success: false, message: "Gemini chat error", error: err.message });
    }
});

module.exports = router;
