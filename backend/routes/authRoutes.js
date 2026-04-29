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
router.get("/refresh", protect, refresh);
router.get("/logout", logout);
router.get("/nonce", nonce);
router.post("/siwe", siwe);

export default router;
