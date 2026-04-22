import { apiRequest } from "./api";

// 🤖 Ask AI
export const askAI = (message, history = []) =>
  apiRequest("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });