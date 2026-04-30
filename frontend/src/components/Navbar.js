"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Sprout, X } from "lucide-react";
import WalletButton from "./WalletButton";
import "@/styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Compare", path: "/compare" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Crop", path: "/add" },
    { name: "Analytics", path: "/analytics" },
    { name: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        <span aria-hidden="true">
          <Sprout size={18} />
        </span>
        <strong>AgriChain</strong>
      </Link>

      <div className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={isActive(link.path) ? "active" : ""}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <WalletButton />
        <button
          className="menu-btn"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div ref={menuRef} className={`mobile-menu ${open ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={isActive(link.path) ? "active" : ""}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
