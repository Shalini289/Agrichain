"use client";

import { useState } from "react";
import styles from "@/styles/auth.module.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState("");

  const checkStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/))
      return "Strong";
    return "Medium";
  };

  const handleRegister = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create Account 🚀</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className={styles.passwordBox}>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setStrength(checkStrength(e.target.value));
            }}
          />
          <span onClick={() => setShow(!show)}>
            {show ? "🙈" : "👁"}
          </span>
        </div>

        <p className={styles.strength}>
          Strength: {strength}
        </p>

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}