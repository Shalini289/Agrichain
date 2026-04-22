export default function AIInsights({ prediction, mandi }) {
  const trend = prediction > mandi ? "📈 Rising" : "📉 Falling";

  return (
    <div style={styles.box}>
      <h3>🧠 AI Insights</h3>
      <p>Predicted Price: ₹{prediction}</p>
      <p>Mandi Price: ₹{mandi}</p>
      <p>Trend: {trend}</p>
    </div>
  );
}

const styles = {
  box: {
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    background: "rgba(255,255,255,0.05)",
  },
};