"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>

      {/* 🚀 HERO */}
      <section style={{ textAlign: "center", paddingTop: 80 }}>

        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: "3rem", fontWeight: "bold" }}
        >
          🌾 AgriChain
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 20, fontSize: "1.2rem", color: "#ccc" }}
        >
          AI + Blockchain platform for smarter farming decisions
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 30 }}
        >
          <Link href="/dashboard">
            <button className="btn">🚀 Get Started</button>
          </Link>

          <Link href="/login">
            <button className="btn secondary">Login</button>
          </Link>
        </motion.div>
      </section>


      {/* ⚡ FEATURES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 80,
        }}
      >
        {[
          "🔗 Blockchain Transparency",
          "🧠 AI Price Prediction",
          "📊 Smart Analytics",
          "⚖ Fair Trade System",
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: 20,
              borderRadius: 15,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            {f}
          </motion.div>
        ))}
      </section>


      {/* 📢 CTA */}
      <section style={{ textAlign: "center", marginTop: 80 }}>
        <h2>Empowering Farmers with Technology</h2>

        <Link href="/register">
          <button className="btn">Join Now</button>
        </Link>
      </section>

    </div>
  );
}