import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// 🔧 Body parser
app.use(express.json());

// 🍪 Cookies
app.use(cookieParser());

// 🌍 CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/chat", chatRoutes);

// 🏠 Health check
app.get("/", (req, res) => {
  res.send("API running...");
});

// ❌ Error handler (LAST)
app.use(errorHandler);

// 🚀 Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});