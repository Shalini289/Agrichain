"use client";
import { useEffect, useState } from "react";
import { getCrop } from "../../../services/api";
import Loader from "../../../components/Loader";
import AIInsights from "../../../components/AIInsights";


export default function Track({ params }) {
  const [crop, setCrop] = useState(null);

  useEffect(() => {
    getCrop(params.id).then(res => setCrop(res.data));
  }, []);

  if (!crop) return <Loader />;

  return (
    <div className="card">
      <h2>{crop.name}</h2>
      <p>Current Price: ₹{crop.price}</p>
      <p>Mandi Price: ₹{crop.mandiPrice}</p>
      <p>Profit: ₹{crop.profit}</p>

      <h3>History</h3>
      {crop.history.map((h, i) => (
        <p key={i}>
          {h.role} → {new Date(h.timestamp).toLocaleString()}
        </p>
      ))}
      <AIInsights
  predicted={crop.predictedPrice}
  mandi={crop.mandiPrice}
/>
    </div>
  );
}