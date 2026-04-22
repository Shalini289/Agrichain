"use client";
import { useState } from "react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 35,
          height: 35,
          borderRadius: "50%",
          background: "#00c6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        👤
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: 45,
          right: 0,
          background: "#111",
          padding: 10,
          borderRadius: 10
        }}>
          <p>Profile</p>
          <p>Logout</p>
        </div>
      )}
    </div>
  );
}