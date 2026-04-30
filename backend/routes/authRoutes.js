import express from "express";
import {
  login,
  logout,
  me,
  nonce,
  refresh,
  register,
  siwe,
  verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.get("/me", protect, me);
router.post("/refresh", protect, refresh);
router.post("/logout", logout);
router.post("/nonce", nonce);
router.post("/siwe", siwe);

export default router;
