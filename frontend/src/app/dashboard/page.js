"use client";

import { useEffect, useState } from "react";
import Chatbot from "@/components/Chatbot";
import AIInsights from "@/components/AIInsights";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setCrops(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>📊 Dashboard</h1>

      {/* 🌀 Loading */}
      {loading && <p>Loading crops...</p>}

      {/* 🌾 Crop List */}
      <div style={{ marginTop: 20 }}>
        {crops.map((crop) => (
          <div
            key={crop._id}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <h3>{crop.name}</h3>
            <p>Price: ₹{crop.price}</p>
            <p>Quantity: {crop.quantity}</p>
            <p>Tx: {crop.txHash?.slice(0, 10)}...</p>
          </div>
        ))}
      </div>

      {/* 🧠 AI Insights */}
      <AIInsights prediction={35} mandi={30} />

      {/* 🤖 Chatbot */}
      <Chatbot />
    </div>
  );
}