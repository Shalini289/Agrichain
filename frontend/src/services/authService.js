import { apiRequest } from "./apiService";

// 🔐 Register
export const authService = {
  register: async (payload) => {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return data;
  },
};

// 🔐 Login
export const loginUser = (data) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// 👤 Profile
export const getProfile = () =>
  apiRequest("/api/auth/me");

// 🔄 Refresh token
export const refreshToken = () =>
  apiRequest("/api/auth/refresh");

// 🚪 Logout
export const logoutUser = () =>
  apiRequest("/api/auth/logout");