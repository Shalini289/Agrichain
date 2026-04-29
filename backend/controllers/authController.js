import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ethers } from "ethers";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const buildVerifyLink = (token) =>
  `${process.env.CLIENT_URL || "http://localhost:3000"}/verify/${token}`;

const getDevVerifyLink = (token) =>
  process.env.NODE_ENV === "production" ? undefined : buildVerifyLink(token);

const sendVerificationEmail = async (email, token) => {
  const verifyLink = buildVerifyLink(token);

  try {
    await sendEmail(
      email,
      "Verify your account",
      `Click to verify: ${verifyLink}`
    );
    return true;
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw err;
    }

    console.warn("Verification email was not sent:", err.message);
    return false;
  }
};

export const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      if (!exists.isVerified) {
        if (!exists.verifyToken) {
          exists.verifyToken = crypto.randomBytes(32).toString("hex");
          await exists.save();
        }

        const emailSent = await sendVerificationEmail(email, exists.verifyToken);
        return res.json({
          message: emailSent
            ? "Account already exists. Check email to verify."
            : "Account already exists. Use the local verify link to continue.",
          verifyLink: getDevVerifyLink(exists.verifyToken),
        });
      }

      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    await User.create({
      name,
      email,
      password: hashed,
      verifyToken: token,
    });

    const emailSent = await sendVerificationEmail(email, token);

    res.json({
      message: emailSent
        ? "Registered. Check email to verify."
        : "Registered. Use the local verify link to continue.",
      verifyLink: getDevVerifyLink(token),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verifyToken: req.params.token });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    res.json({ message: "Email verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      if (!user.verifyToken) {
        user.verifyToken = crypto.randomBytes(32).toString("hex");
        await user.save();
      }

      return res.status(401).json({
        message: "Verify email first",
        verifyLink: getDevVerifyLink(user.verifyToken),
      });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const refresh = async (req, res) => {
  const token = generateToken(req.user._id);
  res.cookie("token", token, cookieOptions);
  res.json({ message: "Session refreshed" });
};

export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
};

export const nonce = (req, res) => {
  req.session.siweNonce = crypto.randomBytes(16).toString("hex");
  res.json({ nonce: req.session.siweNonce });
};

export const siwe = async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    const nonceValue = req.session.siweNonce;

    if (!address || !signature || !message || !nonceValue || !message.includes(nonceValue)) {
      return res.status(400).json({ message: "Invalid SIWE request" });
    }

    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const user = await User.findOneAndUpdate(
      { wallet: recovered.toLowerCase() },
      {
        $setOnInsert: {
          name: `Wallet ${recovered.slice(0, 6)}`,
          email: `${recovered.toLowerCase()}@wallet.local`,
          isVerified: true,
        },
        wallet: recovered.toLowerCase(),
      },
      { new: true, upsert: true }
    ).select("-password");

    req.session.siweNonce = null;
    res.cookie("token", generateToken(user._id), cookieOptions);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
