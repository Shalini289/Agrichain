"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading profile...</p>;

  if (!user) return <p>Not logged in ❌</p>;

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>👤 Profile</h1>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 15,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Wallet:</strong> {user.wallet || "Not connected"}</p>

        <p>
          <strong>Status:</strong>{" "}
          {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
        </p>
      </div>
    </div>
  );
}