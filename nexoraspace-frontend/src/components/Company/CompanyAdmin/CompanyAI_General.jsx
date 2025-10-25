import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, History, Eye } from "lucide-react";
import api from "../../../api/axios";

function CompanyAI_General() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I’m your AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(Date.now().toString());
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [viewingChat, setViewingChat] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧾 Load session summaries
  const loadHistory = async () => {
    try {
      const res = await api.get("/api/company/data/aichat/history");
      if (res.data.success) {
        setChatHistory(res.data.chats);
        setShowHistory(true);
      }
    } catch (err) {
      console.error("❌ Failed to load chat history:", err);
    }
  };

  // 🔍 View full chat by sessionId
  const viewChat = async (sid) => {
    try {
      const res = await api.get(`/api/company/data/aichat/history/${sid}`);
      if (res.data.success && res.data.chat) {
        setViewingChat(res.data.chat);
      }
    } catch (err) {
      console.error("❌ Failed to load chat session:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/company/data/aichat/send", {
        text: userMsg.text,
        sessionId,
      });

      if (res.data.success) {
        setSessionId(res.data.sessionId);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: res.data.response },
        ]);
      }
    } catch (err) {
      console.error("❌ Send error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Network error, please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "🆕 New session started! How can I assist you?",
      },
    ]);
    setSessionId(Date.now().toString());
  };

  const deleteChat = async (sid) => {
    if (!window.confirm("Are you sure you want to delete this chat session?")) return;
    try {
      const res = await api.delete(`/api/company/data/aichat/history/${sid}`);
      if (res.data.success) {
        alert("Chat deleted successfully!");
        setChatHistory((prev) => prev.filter((c) => c.sessionId !== sid));
        setViewingChat(null);
      } else {
        alert("Failed to delete chat: " + res.data.message);
      }
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
      alert("Error deleting chat.");
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between z-20">
          <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Bot className="text-blue-600" /> Nexora AI Assistant
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm"
            >
              <History size={16} /> View History
            </button>
            <button
              onClick={startNewChat}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              New Chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm border ${msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none border-blue-200"
                    : "bg-white text-gray-800 rounded-bl-none border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs">
                  {msg.sender === "ai" ? (
                    <Bot className="text-blue-500" size={14} />
                  ) : (
                    <User className="text-gray-200" size={14} />
                  )}
                  <span
                    className={`${msg.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                      }`}
                  >
                    {msg.sender === "ai" ? "AI Assistant" : "You"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl border border-gray-200">
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <footer className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-10 py-4 z-30">
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-2xl p-2 shadow-sm">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="flex-1 resize-none bg-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none px-3 py-2"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`flex items-center justify-center ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-xl px-4 py-2 ml-2 active:scale-95 transition`}
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl p-6 relative">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <History className="text-blue-600" /> Previous Chats
            </h2>
            <ul className="max-h-80 overflow-y-auto space-y-3">
              {chatHistory.map((c, i) => (
                <li
                  key={i}
                  className="border rounded-lg p-3 hover:bg-gray-100 text-sm flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Session:</strong> {c.sessionId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Messages: {c.totalMessages} |{" "}
                      {new Date(c.lastInteractionAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewChat(c.sessionId)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => deleteChat(c.sessionId)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setShowHistory(false);
                setViewingChat(null);
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Close
            </button>

            {/* Full Chat Viewer */}
            {viewingChat && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Full Chat (Session {viewingChat.sessionId})
                </h3>
                <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2">
                  {viewingChat.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-md ${m.sender === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      <strong>{m.sender === "user" ? "You" : "AI"}:</strong>{" "}
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyAI_General;
