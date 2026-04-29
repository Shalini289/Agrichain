import jwt from "jsonwebtoken";

export const socketHandler = (io) => {
  // 🔐 Middleware (optional auth)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (token) {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user;
      }

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // 🔔 Send welcome notification
    socket.emit("notification", "Connected to AgriChain 🚀");

    // 📊 Example: live price updates
    const interval = setInterval(() => {
      const price = Math.floor(Math.random() * 50) + 20;

      socket.emit("priceUpdate", price);
    }, 5000);

    // 🤖 AI streaming (example)
    socket.on("askAI", (message) => {
      const words = ["Prices", "are", "rising", "due", "to", "high", "demand"];

      let i = 0;

      const stream = setInterval(() => {
        if (i >= words.length) {
          clearInterval(stream);
          return;
        }

        socket.emit("aiStream", words[i] + " ");
        i++;
      }, 300);
    });

    // 🌾 Crop added event (from backend)
    socket.on("cropAdded", (data) => {
      socket.broadcast.emit("notification", `New crop: ${data.name}`);
    });

    // ❌ Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      clearInterval(interval);
    });
  });
};