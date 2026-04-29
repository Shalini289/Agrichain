import express from "express";
import { chat, predict } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Optional: protect chatbot
router.post("/", protect, chat);
router.get("/predict", predict);

export default router;
