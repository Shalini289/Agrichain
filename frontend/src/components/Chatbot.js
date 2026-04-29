"use client";

import { useState } from "react";
import "@/styles/dashboard.css";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!msg.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: msg.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "AI request failed");
      }

      setReply(data.reply || "No response returned.");
      setMsg("");
    } catch (err) {
      setReply(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h3>AI Assistant</h3>
        <span>Ask anything about crops and prices</span>
      </div>

      <div className="chatbox">
        {reply ? (
          <div className="chat-message bot">{reply}</div>
        ) : (
          <div className="chat-placeholder">
            Ask me anything about farming, prices, or predictions...
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          value={msg}
          placeholder="Type your question..."
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button onClick={send} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
