"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Trace every crop",
      text: "Blockchain-backed history keeps ownership, pricing, and movement visible.",
    },
    {
      title: "Predict smarter prices",
      text: "AI signals help farmers compare market movement before making decisions.",
    },
    {
      title: "See the farm pulse",
      text: "Dashboards turn crop quantity, value, and activity into readable insight.",
    },
    {
      title: "Trade with confidence",
      text: "A clearer chain of custody supports fairer, faster agricultural exchange.",
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <motion.span
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="hero-eyebrow"
          >
            AI agriculture ledger
          </motion.span>

          <motion.h1
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            AgriChain
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            A premium operating layer for transparent crop records, market intelligence, and smarter farmer decisions.
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="hero-buttons"
          >
            <Link href="/dashboard" className="btn btn-primary">Open Dashboard</Link>
            <Link href="/login" className="btn btn-secondary">Login</Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="hero-panel"
        >
          <div className="hero-panel-top">
            <span>Market confidence</span>
            <strong>Live</strong>
          </div>
          <div className="hero-metric">
            <strong>Rs. 42K</strong>
            <p className="hero-subtitle">Projected value across verified crop lots this week.</p>
            <div className="hero-bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -4 }}
            className="card feature-card"
          >
            <strong>{feature.title}</strong>
            <span>{feature.text}</span>
          </motion.div>
        ))}
      </section>

      <section className="cta">
        <h2 className="cta-title">Build a cleaner market record from the first crop entry.</h2>
        <Link href="/register" className="btn btn-primary">Create Account</Link>
      </section>
    </div>
  );
}
