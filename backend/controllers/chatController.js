import { askAI, getAIPrediction } from "../services/aiService.js";

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    if (message.length > 1000) {
      return res.status(400).json({ message: "Message must be 1000 characters or less" });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
    const reply = await askAI(message.trim(), safeHistory);

    res.json({ reply });

  } catch (err) {
    console.error("AI chat failed:", err.message);
    res.status(500).json({
      message: "AI service error"
    });
  }
};

export const predict = async (req, res) => {
  try {
    const prediction = await getAIPrediction();
    res.json(prediction);
  } catch (err) {
    console.error("AI prediction failed:", err.message);
    res.status(500).json({
      message: "AI prediction error"
    });
  }
};
