import React, { useState, useRef, useEffect } from "react";
import SideMenu from "./SideMenu";
import { Send, Bot, User } from "lucide-react";

function CompanyAI_General() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I’m your AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "I’m here to assist you with your company’s AI, finance, and project data. What would you like to discuss?",
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <SideMenu />

      {/* Chat Interface */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between z-20">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Bot className="text-blue-600" /> Nexora AI Assistant
          </h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm border ${
                  msg.sender === "user"
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
                    className={`${
                      msg.sender === "user"
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
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
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
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 ml-2 active:scale-95 transition"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Nexora AI may produce responses that require verification.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default CompanyAI_General;
