"use client";

import { useEffect, useState } from "react";
import Chatbot from "@/components/Chatbot";
import AIInsights from "@/components/AIInsights";
import { connectSocket, socket } from "@/services/socket";
import { useUIStore } from "@/store/uiStore";
import "@/styles/dashboard.css";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addNotification = useUIStore((state) => state.addNotification);
  const prices = crops.map((crop) => Number(crop.price) || 0);
  const averagePrice = crops.length
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) / crops.length)
    : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load crops");
        return res.json();
      })
      .then((data) => {
        setCrops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    connectSocket();

    socket.on("cropAdded", (data) => {
      addNotification(`New crop added: ${data.name}`);
      setCrops((prev) => [data, ...prev]);
    });

    return () => socket.off("cropAdded");
  }, [addNotification]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Real-time crop data powered by Blockchain</p>
      </div>

      {loading && <div className="dashboard-loading">Loading crops...</div>}
      {error && <div className="empty-state">{error}</div>}

      {!loading && crops.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{crops.length}</h3>
            <p>Total Crops</p>
          </div>

          <div className="stat-card">
            <h3>Rs. {averagePrice}</h3>
            <p>Avg Price</p>
          </div>

          <div className="stat-card">
            <h3>Rs. {highestPrice}</h3>
            <p>Highest Price</p>
          </div>
        </div>
      )}

      <div className="crop-list">
        {!loading && !error && crops.length === 0 && (
          <div className="empty-state">No crops available</div>
        )}

        {crops.map((crop) => (
          <div key={crop._id} className="crop-card">
            <h3>{crop.name}</h3>
            <p>Price: Rs. {crop.price}</p>
            <p>Quantity: {crop.quantity}</p>
            <p className="tx">
              Tx: {crop.txHash ? `${crop.txHash.slice(0, 12)}...` : "Pending"}
            </p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <AIInsights prediction={35} mandi={30} />
      </div>

      <Chatbot />
    </div>
  );
}
