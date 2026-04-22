"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 Password strength checker
  const checkStrength = (pwd) => {
    if (pwd.length < 6) return "Weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "Strong";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setStrength(checkStrength(value));
    }

    setForm({ ...form, [name]: value });
  };

  // 🔗 Wallet signup
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();

    setForm(prev => ({ ...prev, wallet: address }));
    alert("Wallet connected ✅");
  };

  const handleSubmit = async () => {
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      return setError(data.message);
    }

    setSuccess("Verification email sent 📧");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2>Create Account</h2>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <div className={styles.passwordBox}>
          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span onClick={() => setShow(!show)}>
            {show ? "🙈" : "👁"}
          </span>
        </div>

        {/* STRENGTH */}
        {form.password && (
          <p className={styles.strength}>
            Strength: {strength}
          </p>
        )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        {/* WALLET */}
        <button className="btn" onClick={connectWallet}>
          🔗 Connect Wallet
        </button>

        <button className="btn" onClick={handleSubmit}>
          Register
        </button>

      </div>
    </div>
  );
}