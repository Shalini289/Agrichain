"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const [loading, setLoading] = useState(false);

  const validators = {
    name: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    },
    email: (value) => {
      const email = value.trim();
      if (!email) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
      return "";
    },
    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    },
    confirmPassword: (value) => {
      if (!value) return "Confirm your password";
      if (value !== form.password) return "Passwords do not match";
      return "";
    },
  };

  const errors = {
    name: validators.name(form.name),
    email: validators.email(form.email),
    password: validators.password(form.password),
    confirmPassword: validators.confirmPassword(form.confirmPassword),
  };

  const passwordScore = [
    form.password.length >= 6,
    /[A-Z]/.test(form.password),
    /[a-z]/.test(form.password),
    /\d/.test(form.password),
  ].filter(Boolean).length;

  const strengthClass =
    passwordScore <= 1 ? styles.weak : passwordScore <= 3 ? styles.medium : styles.strong;
  const strengthText =
    passwordScore <= 1 ? "Weak password" : passwordScore <= 3 ? "Medium password" : "Strong password";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
    setVerifyLink("");
  };

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field) => touched[field] && errors[field];
  const isValid = Object.values(errors).every((message) => !message);

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setVerifyLink("");

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) {
      setError("Please fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(data.message || "Registered. Verify your email before logging in.");
      if (data.verifyLink) {
        setVerifyLink(data.verifyLink);
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create your account</h2>
        <p className={styles.subtitle}>
          Start tracking verified crop records and AI-assisted market insights.
        </p>

        <input
          className={styles.input}
          placeholder="Full name"
          value={form.name}
          onBlur={() => markTouched("name")}
          onChange={(e) => updateField("name", e.target.value)}
        />
        {showError("name") && <p className={styles.error}>{errors.name}</p>}

        <input
          className={styles.input}
          placeholder="Email address"
          type="email"
          value={form.email}
          onBlur={() => markTouched("email")}
          onChange={(e) => updateField("email", e.target.value)}
        />
        {showError("email") && <p className={styles.error}>{errors.email}</p>}

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onBlur={() => markTouched("password")}
          onChange={(e) => updateField("password", e.target.value)}
        />
        {form.password && (
          <div className={styles.strengthBox}>
            <div className={`${styles.strengthBar} ${strengthClass}`}></div>
            <p className={styles.strengthText}>{strengthText}</p>
          </div>
        )}
        {showError("password") && <p className={styles.error}>{errors.password}</p>}

        <input
          className={styles.input}
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onBlur={() => markTouched("confirmPassword")}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
        />
        {form.confirmPassword && !errors.confirmPassword && (
          <p className={styles.passwordMatch}>Passwords match</p>
        )}
        {showError("confirmPassword") && (
          <p className={styles.passwordMismatch}>{errors.confirmPassword}</p>
        )}

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        {verifyLink && (
          <Link href={verifyLink} className={styles.button}>
            Verify email now
          </Link>
        )}

        {!verifyLink && (
          <button className={styles.button} onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        )}

        <p className={styles.footer}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
