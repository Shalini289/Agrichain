"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.style.background = dark
      ? "radial-gradient(circle at top, #1f4037, #0f2027)"
      : "#f5f5f5";

    document.body.style.color = dark ? "white" : "black";
  }, [dark]);

  return (
    <button className="btn" onClick={() => setDark(!dark)}>
      {dark ? "🌙" : "☀️"}
    </button>
  );
}