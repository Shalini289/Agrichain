import express from "express";
import {
  stats,
  trend,
  prediction,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stats", stats);
router.get("/trend", trend);
router.get("/prediction", prediction);

export default router;