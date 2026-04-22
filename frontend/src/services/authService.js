import { apiRequest } from "./api";

// 🔐 Register
export const registerUser = (data) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// 🔐 Login
export const loginUser = (data) =>
  apiRequest("/api/auth/login", {
    method: "POST",
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