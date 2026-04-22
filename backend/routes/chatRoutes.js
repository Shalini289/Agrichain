import express from "express";
import { chat } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Optional: protect chatbot
router.post("/", protect, chat);

export default router;