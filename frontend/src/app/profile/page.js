"use client";

import { useEffect, useState } from "react";
import"@/styles/profile.css";
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

  if (loading) {
    return (
      <div className="profile-loading">
        ⏳ Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-empty">
        ❌ Not logged in
      </div>
    );
  }

  return (
    <div className="profile">

      {/* 👤 HEADER */}
      <div className="profile-header">
        <h1>👤 Profile</h1>
        <span className={user.isVerified ? "status verified" : "status not-verified"}>
          {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
        </span>
      </div>

      {/* 📦 CARD */}
      <div className="profile-card">

        <div className="profile-item">
          <span>Name</span>
          <strong>{user.name || "N/A"}</strong>
        </div>

        <div className="profile-item">
          <span>Email</span>
          <strong>{user.email || "N/A"}</strong>
        </div>

        <div className="profile-item">
          <span>Wallet</span>
          <strong>
            {user.wallet
              ? `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}`
              : "Not connected"}
          </strong>
        </div>

      </div>

    </div>
  );
}
