import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 🔄 Auto refresh logic
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (!original) {
      return Promise.reject(err);
    }

    if (original.url?.includes("/api/auth/login") || original.url?.includes("/api/auth/refresh")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { withCredentials: true }
        );

        return API(original); // retry request
      } catch (refreshErr) {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
