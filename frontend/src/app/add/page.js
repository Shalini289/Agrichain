"use client";
import { useState } from "react";
import { addCrop } from "../../services/api";

export default function AddCrop() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: ""
  });

  const handleSubmit = async () => {
    await addCrop(form);
    alert("Crop Added Successfully!");
  };

  return (
    <>
      <h2>Add Crop</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Quantity" onChange={e => setForm({...form, quantity:e.target.value})} />
      <input placeholder="Price" onChange={e => setForm({...form, price:e.target.value})} />

      <button className="btn" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
}