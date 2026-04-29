"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyLink, setVerifyLink] = useState("");

  const handleLogin = async () => {
    setError("");
    setVerifyLink("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.verifyLink) {
          setVerifyLink(data.verifyLink);
        }

        const message =
          data.message === "Verify email first"
            ? "Please verify your email first, then log in again."
            : data.message || "Invalid email or password";
        throw new Error(message);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* 🔐 Title */}
        <h2 className={styles.title}>Welcome Back 👋</h2>
        <p className={styles.subtitle}>
          Login to continue to AgriChain
        </p>

        {/* 📧 Email */}
        <input
          className={styles.input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* 🔑 Password */}
        <div className={styles.passwordBox}>
          <input
            className={styles.input}
            type={show ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <span
            className={styles.eye}
            onClick={() => setShow(!show)}
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {verifyLink && (
          <a href={verifyLink} className={styles.button}>
            Verify email now
          </a>
        )}

        {/* 🔘 Button */}
        {!verifyLink && (
        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        )}

        {/* 🔗 Footer */}
        <p className={styles.footer}>
          Don’t have an account?{" "}
          <a href="/register">Register</a>
        </p>

      </div>
    </div>
  );
}
