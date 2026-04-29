import { create } from "zustand";
import API from "@/lib/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  role: null,

  fetchUser: async () => {
    try {
      const res = await API.get("/api/auth/me");
      set({
        user: res.data,
        role: res.data.role,
        loading: false,
      });
    } catch {
      set({ user: null, role: null, loading: false });
    }
  },

  logout: async () => {
    try {
      await API.get("/api/auth/logout");
    } finally {
      set({ user: null, role: null, loading: false });
    }
  },
}));
