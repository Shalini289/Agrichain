"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdvancedAnalytics({ data }) {
  const chartData = data.map((value, i) => ({
    name: i + 1,
    price: value,
  }));

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line dataKey="price" stroke="#00c6ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}