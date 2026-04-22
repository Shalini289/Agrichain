"use client";

import { useState } from "react";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!msg) return;

    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      }
    );

    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  return (
    <div style={styles.box}>
      <h3>🤖 AI Assistant</h3>

      <input
        placeholder="Ask something..."
        onChange={(e) => setMsg(e.target.value)}
      />

      <button onClick={send}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {reply && <p style={{ marginTop: 10 }}>💬 {reply}</p>}
    </div>
  );
}

const styles = {
  box: {
    marginTop: 40,
    padding: 20,
    borderRadius: 15,
    background: "rgba(255,255,255,0.05)",
  },
};