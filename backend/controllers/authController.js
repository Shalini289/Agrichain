import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

import sendEmail from "../utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateToken.js";

// 📌 REGISTER
export const register = async (req, res) => {
  const { name, email, password, wallet } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      wallet,
      verificationToken
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    await sendEmail(email, "Verify Email", verifyLink);

    res.json({ message: "Verification email sent" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📧 VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔗 WALLET LOGIN
export const walletLogin = async (req, res) => {
  const { address, signature } = req.body;

  try {
    const message = "Login to AgriChain";

    const recovered = ethers.verifyMessage(message, signature);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    let user = await User.findOne({ wallet: address });

    if (!user) {
      user = await User.create({ wallet: address });
    }

    const accessToken = generateAccessToken(user);

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const refresh = req.cookies.refresh;

  if (!refresh) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    const newAccess = generateAccessToken(user);

    res.cookie("token", newAccess, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({ message: "Token refreshed" });

  } catch {
    res.sendStatus(403);
  }
};

// 👤 PROFILE
export const getProfile = async (req, res) => {
  res.json(req.user);
};