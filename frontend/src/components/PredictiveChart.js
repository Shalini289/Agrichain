"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PredictiveChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 📊 Past prices
      const res = await API.get("/api/crops");
      const past = res.data.map((c, i) => ({
        day: i + 1,
        actual: c.price,
      }));

      // 🔮 Future prediction (AI service)
      const pred = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/predict`
      ).then((r) => r.json());

      const future = pred.predictions.map((p, i) => ({
        day: past.length + i + 1,
        predicted: p,
      }));

      setData([...past, ...future]);
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* 📈 Actual */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#00c6ff"
            name="Actual Price"
          />

          {/* 🔮 Predicted */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#ff9800"
            strokeDasharray="5 5"
            name="Predicted Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}