import { create } from "zustand";

export const useUIStore = create((set) => ({
  notifications: [],

  addNotification: (msg) =>
    set((state) => ({
      notifications: [...state.notifications, msg],
    })),

  removeNotification: () =>
    set((state) => ({
      notifications: state.notifications.slice(1),
    })),
}));