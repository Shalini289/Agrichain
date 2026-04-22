"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      animate={{ width: open ? 200 : 40 }}
      style={{
        overflow: "hidden",
        borderRadius: 20,
        background: "rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        cursor: "pointer"
      }}
      onClick={() => setOpen(true)}
    >
      🔍
      {open && (
        <input
          autoFocus
          placeholder="Search..."
          style={{
            marginLeft: 8,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white"
          }}
        />
      )}
    </motion.div>
  );
}