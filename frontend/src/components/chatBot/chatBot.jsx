import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import "./chatBot.css";

const SUGGESTED_QUESTIONS = [
  "Which category am I spending the most on?",
  "Give me savings tips based on my spending",
  "How does this month compare to last month?",
  "Forecast my expenses for next month",
];


const ChatBot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI financial advisor. Ask me anything or pick a question below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading]  = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      chatRef.current &&
      !chatRef.current.contains(e.target) &&
      !e.target.closest(".chat-fab") // ← don't close when clicking the FAB button
          ) {
            setIsOpen(false);
          }
        };

        if (isOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isOpen]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setShowSuggestions(false);

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" ref={chatRef}>

          {/* Header */}
          <div className="chat-header">
            <Bot size={20} />
            <span>AI Financial Advisor</span>
            <button onClick={() => setIsOpen(false)}><X size={15} /></button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <div className="bubble-icon">
                  {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="bubble-text">{msg.content}</div>
              </div>
            ))}

            {/* Suggested Questions */}
            {showSuggestions && (
              <div className="suggestions">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-bubble assistant">
                <div className="bubble-icon"><Bot size={16} /></div>
                <div className="bubble-text typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              <Send size={18} />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatBot;