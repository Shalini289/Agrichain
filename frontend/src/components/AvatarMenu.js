"use client";
import { useState } from "react";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <img
        src="https://i.pravatar.cc/40"
        style={{
          borderRadius: "50%",
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div style={{
          position: "absolute",
          top: 50,
          right: 0,
          background: "#111",
          borderRadius: 10,
          padding: 10,
          minWidth: 150
        }}>
          <p>👤 Profile</p>
          <p>⚙ Settings</p>
          <p>🚪 Logout</p>
        </div>
      )}
    </div>
  );
}