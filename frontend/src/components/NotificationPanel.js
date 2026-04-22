"use client";
import { useState } from "react";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <span onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        🔔
      </span>

      {open && (
        <div style={{
          position: "absolute",
          top: 40,
          right: 0,
          background: "#111",
          borderRadius: 10,
          padding: 15,
          width: 220
        }}>
          <p>📦 Crop shipped</p>
          <p>💰 Payment received</p>
          <p>📊 Price increased</p>
        </div>
      )}
    </div>
  );
}