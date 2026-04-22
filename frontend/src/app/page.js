"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: "3rem" }}
      >
        🌾 AgriChain
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        Transparent agricultural supply chain powered by Blockchain + AI.
        Track crops, ensure fair pricing, and empower farmers.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/dashboard">
          <button className="btn">Get Started</button>
        </Link>
      </motion.div>

    </div>
  );
}