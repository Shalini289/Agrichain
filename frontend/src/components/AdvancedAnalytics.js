"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdvancedAnalytics({ initialData = [] }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // 🔴 listen for real-time updates
    socket.on("priceUpdate", (newPrice) => {
      setData((prev) => [...prev.slice(-10), newPrice]); // keep last 10
    });

    return () => socket.off("priceUpdate");
  }, []);

  const chartData = data.map((value, i) => ({
    name: i + 1,
    price: value,
  }));

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Crop Price Trend</h3>
        <span>Last {chartData.length} records</span>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="price" stroke="#45d483" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
