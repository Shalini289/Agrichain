import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔐 Get token from cookies (if using JWT cookies, optional)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 🔗 Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false, // manual control
  transports: ["websocket"], // faster
  withCredentials: true,

  auth: {
    token: getToken(),
  },
});

// 🔌 Connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.auth = { token: getToken() }; // refresh token
    socket.connect();
    console.log("🟢 Socket connected");
  }
};

// ❌ Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔴 Socket disconnected");
  }
};

// 📡 Subscribe to event
export const subscribe = (event, callback) => {
  socket.on(event, callback);
};

// 📴 Unsubscribe
export const unsubscribe = (event) => {
  socket.off(event);
};

// 📤 Emit event
export const emitEvent = (event, data) => {
  socket.emit(event, data);
};
