"use client";

import { useEffect, useState } from "react";

export default function Verify({ params }) {
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${params.token}`
    )
      .then(res => {
        if (res.ok) {
          setStatus("✅ Email verified successfully!");
        } else {
          setStatus("❌ Verification failed.");
        }
      })
      .catch(() => setStatus("❌ Error verifying email."));
  }, [params.token]);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Email Verification</h1>
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}