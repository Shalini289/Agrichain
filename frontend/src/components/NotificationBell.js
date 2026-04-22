"use client";

export default function NotificationBell() {
  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      🔔
      <span style={{
        position: "absolute",
        top: -5,
        right: -5,
        background: "red",
        borderRadius: "50%",
        padding: "2px 6px",
        fontSize: 10
      }}>
        3
      </span>
    </div>
  );
}