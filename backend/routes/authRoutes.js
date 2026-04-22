import express from "express";
import {
  register,
  login,
  verifyEmail,
  walletLogin,
  refreshToken,
  getProfile
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Register + email verify
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

// 🔐 Login
router.post("/login", login);

// 🔗 Wallet login
router.post("/wallet", walletLogin);

// 🔄 Refresh token
router.get("/refresh", refreshToken);

// 👤 Profile
router.get("/me", protect, getProfile);

export default router;