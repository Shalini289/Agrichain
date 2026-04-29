"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/auth.module.css";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${token}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Email verification failed");
        }

        setStatus("Email verified. You can log in now.");
      } catch (err) {
        setStatus(err.message);
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Account Verification</h2>
        <p className={styles.subtitle}>{status}</p>
        <Link href="/login" className={styles.button}>
          Login
        </Link>
      </div>
    </div>
  );
}
