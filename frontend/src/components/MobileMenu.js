"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MobileMenu({ open }) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "70%",
        height: "100%",
        background: "#111",
        padding: 20,
        zIndex: 1000
      }}
    >
      <Link href="/">Home</Link><br/>
      <Link href="/dashboard">Dashboard</Link><br/>
      <Link href="/analytics">Analytics</Link>
    </motion.div>
  );
}