import { askAI } from "../services/aiService.js";

export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const reply = await askAI(message, history);

    res.json({ reply });

  } catch (err) {
    res.status(500).json({
      message: "AI service error",
      error: err.message
    });
  }
};