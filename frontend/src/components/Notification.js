"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export default function Notification() {
  const { notifications, removeNotification } = useUIStore();

  // ⏱ Auto remove after 3s
  useEffect(() => {
    if (notifications.length) {
      const timer = setTimeout(() => {
        removeNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  if (!notifications.length) return null;

  return (
    <div className="toast-container">
      {notifications.map((n, i) => (
        <div key={i} className="toast">
          <span>{n}</span>

          <button
            className="toast-close"
            onClick={removeNotification}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
}