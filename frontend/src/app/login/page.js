"use client";
import { useState } from "react";
import axios from "axios";
import { login } from "@/services/auth";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = login(data);
    localStorage.setItem("token", res.data.token);
 
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setData({...data, email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setData({...data, password:e.target.value})}/>
      <button className="btn" onClick={handleLogin}>Login</button>
    </div>
  );
}