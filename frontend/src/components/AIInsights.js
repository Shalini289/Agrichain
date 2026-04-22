"use client";

export default function AIInsights({ predicted, mandi }) {
  return (
    <div className="card">
      <h3>🧠 AI Insights</h3>
      <p>Predicted Price: ₹{predicted}</p>
      <p>Mandi Price: ₹{mandi}</p>

      {predicted > mandi ? (
        <p style={{ color: "lightgreen" }}>💡 Best time to sell</p>
      ) : (
        <p style={{ color: "orange" }}>⚠ Wait for better price</p>
      )}
    </div>
  );
}