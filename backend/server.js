import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { Server } from "socket.io";
import { pathToFileURL } from "url";

import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { socketHandler } from "./sockets/socketHandler.js";

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (!process.env.JWT_SECRET || !process.env.SESSION_SECRET)) {
  throw new Error("JWT_SECRET and SESSION_SECRET are required in production");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use((req, res, next) => {
  const unsafeMethods = ["POST", "PUT", "PATCH", "DELETE"];
  const origin = req.get("origin");

  if (unsafeMethods.includes(req.method) && origin && origin !== CLIENT_URL) {
    return res.status(403).json({ message: "Invalid request origin" });
  }

  next();
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("AgriChain API Running");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

socketHandler(io);

export { app, io, server };

app.use(errorHandler);

export const startServer = async () => {
  await connectDB();
  return server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  startServer().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
