import Crop from "../models/Crop.js";

// 📊 Basic stats
export const getStats = async () => {
  const crops = await Crop.find();

  const total = crops.length;

  const avgPrice =
    crops.reduce((sum, c) => sum + c.price, 0) / (total || 1);

  const totalQuantity = crops.reduce(
    (sum, c) => sum + c.quantity,
    0
  );

  return {
    totalCrops: total,
    avgPrice: Number(avgPrice.toFixed(2)),
    totalQuantity,
  };
};


// 📈 Price trend (for charts)
export const getPriceTrend = async () => {
  const crops = await Crop.find().sort({ createdAt: 1 });

  return crops.map((c, i) => ({
    day: i + 1,
    price: c.price,
  }));
};


// 🔮 Predict future (simple logic or AI call)
export const getPrediction = async () => {
  // You can replace with AI service call
  return {
    predictions: [35, 38, 40, 42, 45],
  };
};