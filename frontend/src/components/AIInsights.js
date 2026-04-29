import"@/styles/dashboard.css";
export default function AIInsights({ prediction, mandi }) {
  const isRising = prediction > mandi;

  return (
    <div className="ai-card">

      {/* 🧠 Header */}
      <div className="ai-header">
        <h3>🧠 AI Insights</h3>
        <span className={isRising ? "trend up" : "trend down"}>
          {isRising ? "📈 Rising" : "📉 Falling"}
        </span>
      </div>

      {/* 📊 Data */}
      <div className="ai-stats">

        <div className="ai-stat">
          <p className="label">Predicted Price</p>
          <h4>₹{prediction}</h4>
        </div>

        <div className="ai-stat">
          <p className="label">Mandi Price</p>
          <h4>₹{mandi}</h4>
        </div>

      </div>

      {/* 📢 Insight Message */}
      <div className="ai-message">
        {isRising
          ? "Prices are expected to increase. Consider holding crops for better profit."
          : "Prices may drop. Selling early could minimize loss."}
      </div>

    </div>
  );
}