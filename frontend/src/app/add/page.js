"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/add-crop.css";

const initialForm = {
  name: "",
  quantity: "",
  price: "",
};

const friendlyError = (message) => {
  if (message?.includes("INSUFFICIENT_FUNDS") || message?.includes("insufficient funds")) {
    return "Your backend Sepolia wallet has no test ETH for gas. The crop can be saved locally after the backend restart, or fund the wallet to write on-chain.";
  }

  return message || "Unable to add crop";
};

export default function AddCrop() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const errors = useMemo(() => {
    const quantity = Number(form.quantity);
    const price = Number(form.price);

    return {
      name: !form.name.trim() ? "Crop name is required" : "",
      quantity:
        !form.quantity || !Number.isFinite(quantity) || quantity <= 0
          ? "Quantity must be a positive number"
          : "",
      price:
        !form.price || !Number.isFinite(price) || price <= 0
          ? "Price must be a positive number"
          : "",
    };
  }, [form]);

  const isValid = Object.values(errors).every((message) => !message);
  const estimatedValue =
    Number(form.quantity) > 0 && Number(form.price) > 0
      ? Number(form.quantity) * Number(form.price)
      : 0;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const showError = (field) => touched[field] && errors[field];

  const submitCrop = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setTouched({ name: true, quantity: true, price: true });

    if (!isValid) {
      setError("Please fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(friendlyError(data.message));
      }

      setSuccess(
        data.blockchainWarning
          ? `Added ${data.name || form.name.trim()} locally. ${data.blockchainWarning}`
          : `Added ${data.name || form.name.trim()} successfully.`
      );
      setForm(initialForm);
      setTouched({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-crop-page">
      <section className="add-crop-header">
        <div>
          <p className="add-crop-eyebrow">Crop entry</p>
          <h1>Add Crop</h1>
          <p>Register a crop lot with quantity, price, and optional blockchain tracking.</p>
        </div>
        <Link href="/dashboard" className="add-crop-secondary">
          View Dashboard
        </Link>
      </section>

      <section className="add-crop-layout">
        <form className="add-crop-form" onSubmit={submitCrop}>
          <label>
            <span>Crop name</span>
            <input
              value={form.name}
              placeholder="Tomato"
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {showError("name") && <small>{errors.name}</small>}
          </label>

          <label>
            <span>Quantity</span>
            <input
              value={form.quantity}
              type="number"
              min="0"
              step="1"
              placeholder="100"
              onBlur={() => setTouched((current) => ({ ...current, quantity: true }))}
              onChange={(event) => updateField("quantity", event.target.value)}
            />
            {showError("quantity") && <small>{errors.quantity}</small>}
          </label>

          <label>
            <span>Price per unit</span>
            <input
              value={form.price}
              type="number"
              min="0"
              step="0.01"
              placeholder="30"
              onBlur={() => setTouched((current) => ({ ...current, price: true }))}
              onChange={(event) => updateField("price", event.target.value)}
            />
            {showError("price") && <small>{errors.price}</small>}
          </label>

          {error && <p className="add-crop-error">{error}</p>}
          {success && <p className="add-crop-success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Adding crop..." : "Add crop"}
          </button>
        </form>

        <aside className="add-crop-summary">
          <span>Estimated lot value</span>
          <strong>Rs. {estimatedValue.toLocaleString("en-IN")}</strong>
          <p>
            Crop records are saved to the database. If blockchain is configured, the transaction
            hash will appear on the dashboard.
          </p>
        </aside>
      </section>
    </div>
  );
}
