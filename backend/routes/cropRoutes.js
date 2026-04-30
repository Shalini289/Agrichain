import express from "express";
import {
  addCrop,
  getCrops,
  getCrop,
  updateCropStatus
} from "../controllers/cropController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected routes
router.post("/", protect, addCrop);
router.patch("/:id/status", protect, updateCropStatus);

// 📥 Public
router.get("/", getCrops);
router.get("/:id", getCrop);

export default router;
