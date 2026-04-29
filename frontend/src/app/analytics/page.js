"use client";

import { useEffect, useState } from "react";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import "@/styles/analytics.css";
import { apiRequest } from "@/services/apiService"; // 👈 import your service

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/crops") // 👈 replaced fetch
      .then((crops) => {
        const prices = crops.map((c) => c.price);
        setData(prices);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h1 className="analytics-title">Analytics Dashboard</h1>
        <p className="analytics-subtitle">
          Insights powered by AI & Blockchain data
        </p>
      </div>

      <div className="analytics-card">

        {loading && (
          <div className="analytics-loading">
            <p>Loading analytics...</p>
          </div>
        )}

        {!loading && data.length > 0 && (
          <AdvancedAnalytics initialData={data} />
        )}

        {!loading && data.length === 0 && (
          <div className="analytics-empty">
            <p>No data available</p>
            <span>Try adding crop data to view insights</span>
          </div>
        )}

      </div>

    </div>
  );
}
