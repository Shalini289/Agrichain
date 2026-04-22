"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>🌾 AgriChain</h2>

      <div style={styles.links} className="desktop">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/analytics">Analytics</Link>
        <Link href="/profile">Profile</Link>
      </div>

      <div style={styles.right}>
        <WalletButton />
        <span style={styles.menu} onClick={() => setOpen(!open)}>☰</span>
      </div>

      {open && (
        <div style={styles.mobile}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/profile">Profile</Link>
        </div>
      )}
    </div>
  );
}

import WalletButton from "./WalletButton";

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(10px)",
    zIndex: 1000,
  },
  logo: { color: "#00c6ff" },
  links: { display: "flex", gap: 20 },
  right: { display: "flex", gap: 15 },
  menu: { cursor: "pointer", fontSize: 20 },
  mobile: {
    position: "absolute",
    top: 60,
    right: 10,
    background: "#111",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
  },
};