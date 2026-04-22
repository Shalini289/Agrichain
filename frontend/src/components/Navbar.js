"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Navbar.module.css";

import WalletButton from "./WalletButton";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const NavItem = ({ href, label }) => (
    <Link href={href} className={styles.linkWrapper}>
      <span
        className={`${styles.link} ${
          pathname === href ? styles.active : ""
        }`}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <>
      <nav className={styles.navbar}>
        
        {/* LOGO */}
        <div className={styles.logo}>🌾 AgriChain</div>

        {/* CENTER LINKS */}
        <div className={styles.center}>
          <NavItem href="/" label="Home" />
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/analytics" label="Analytics" />
          <NavItem href="/add" label="Add Crop" />
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.right}>
          
          {/* SEARCH */}
          <motion.div
            animate={{ width: searchOpen ? 200 : 40 }}
            className={styles.search}
            onClick={() => setSearchOpen(true)}
          >
            🔍
            {searchOpen && (
              <input
                autoFocus
                placeholder="Search..."
                className={styles.searchInput}
              />
            )}
          </motion.div>

          {/* NOTIFICATIONS */}
          <div className={styles.icon} onClick={() => setNotifOpen(!notifOpen)}>
            🔔
            <span className={styles.badge}>3</span>
          </div>

          {notifOpen && (
            <div className={styles.dropdown}>
              <p>📦 Crop shipped</p>
              <p>💰 Payment received</p>
              <p>📊 Price updated</p>
            </div>
          )}

          {/* WALLET */}
          <WalletButton />

          {/* PROFILE */}
          <div
            className={styles.avatar}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            👤
          </div>

          {profileOpen && (
            <div className={styles.dropdown}>
              <p>Profile</p>
              <p>Settings</p>
              <p>Logout</p>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <div
            className={styles.menu}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* MOBILE PANEL */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className={styles.mobilePanel}
          >
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/analytics">Analytics</Link>
            <Link href="/add">Add Crop</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}