import {
  getStats,
  getPriceTrend,
  getPrediction,
} from "../services/analyticsService.js";

// 📊 Dashboard stats
export const stats = async (req, res) => {
  try {
    const data = await getStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📈 Chart data
export const trend = async (req, res) => {
  try {
    const data = await getPriceTrend();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔮 Prediction
export const prediction = async (req, res) => {
  try {
    const data = await getPrediction();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};