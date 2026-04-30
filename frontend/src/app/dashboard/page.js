"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import AIInsights from "@/components/AIInsights";
import { connectSocket, socket } from "@/services/socket";
import { useUIStore } from "@/store/uiStore";
import "@/styles/dashboard.css";

const statusOptions = ["listed", "reserved", "sold"];

const getTrustScore = (crop) => {
  const score =
    50 +
    (crop.txHash ? 15 : 0) +
    (crop.location ? 10 : 0) +
    (crop.mandiPrice ? 10 : 0) +
    (crop.predictedPrice ? 10 : 0) +
    (crop.notes ? 5 : 0);

  return Math.min(score, 100);
};

export default function Dashboard() {
  const router = useRouter();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const addNotification = useUIStore((state) => state.addNotification);
  const prices = crops.map((crop) => Number(crop.price) || 0);
  const averagePrice = crops.length
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) / crops.length)
    : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const filteredCrops = crops
    .filter((crop) => {
      const text = `${crop.name || ""} ${crop.location || ""} ${crop.quality || ""} ${crop.status || ""}`;
      return text.toLowerCase().includes(query.trim().toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "priceHigh") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sort === "priceLow") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sort === "quantityHigh") return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const fetchCrops = () =>
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

  const loadCrops = () => {
    setLoading(true);
    setError("");
    fetchCrops();
  };

  const exportCsv = () => {
    const headers = ["Name", "Quantity", "Price", "Mandi Price", "Predicted Price", "Location", "Quality", "Status"];
    const rows = filteredCrops.map((crop) => [
      crop.name,
      crop.quantity,
      crop.price,
      crop.mandiPrice || "",
      crop.predictedPrice || "",
      crop.location || "",
      crop.quality || "",
      crop.status || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrichain-crops.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyTraceLink = async (cropId) => {
    const traceUrl = `${window.location.origin}/track/${cropId}`;

    try {
      await navigator.clipboard.writeText(traceUrl);
      addNotification("Crop passport link copied");
    } catch {
      addNotification(traceUrl);
    }
  };

  const updateStatus = async (cropId, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops/${cropId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Unable to update crop status");
      }

      setCrops((current) => current.map((crop) => (crop._id === cropId ? data : crop)));
      addNotification(`Crop marked ${status}`);
    } catch (err) {
      addNotification(err.message);
    }
  };

  useEffect(() => {
    fetchCrops();
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
        <div>
          <h1>Dashboard</h1>
          <p>Real-time crop data powered by Blockchain</p>
        </div>
        <Link href="/add" className="dashboard-action">Add Crop</Link>
      </div>

      <div className="dashboard-toolbar">
        <input
          value={query}
          placeholder="Search crop, location, quality..."
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest first</option>
          <option value="priceHigh">Price high to low</option>
          <option value="priceLow">Price low to high</option>
          <option value="quantityHigh">Quantity high to low</option>
        </select>
        <button type="button" onClick={loadCrops}>Refresh</button>
        <button type="button" onClick={exportCsv} disabled={filteredCrops.length === 0}>
          Export CSV
        </button>
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

        {!loading && !error && crops.length > 0 && filteredCrops.length === 0 && (
          <div className="empty-state">No crops match your search</div>
        )}

        {filteredCrops.map((crop) => (
          <div key={crop._id} className="crop-card">
            <div className="crop-card-top">
              <h3>{crop.name}</h3>
              <span>{crop.status || "listed"}</span>
            </div>
            <div className="crop-trust">
              <strong>{getTrustScore(crop)}%</strong>
              <span>Trust score</span>
            </div>
            <p>Price: Rs. {crop.price}</p>
            <p>Quantity: {crop.quantity}</p>
            {crop.mandiPrice && <p>Mandi: Rs. {crop.mandiPrice}</p>}
            {crop.predictedPrice && <p>Predicted: Rs. {crop.predictedPrice}</p>}
            {crop.location && <p>Location: {crop.location}</p>}
            <p>Quality: {crop.quality || "standard"}</p>
            <p className="tx">
              Tx: {crop.txHash ? `${crop.txHash.slice(0, 12)}...` : "Pending"}
            </p>
            <div className="crop-actions">
              <select
                aria-label={`Update status for ${crop.name}`}
                value={crop.status || "listed"}
                onChange={(event) => updateStatus(crop._id, event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <Link href={`/track/${crop._id}`}>Passport</Link>
              <button type="button" onClick={() => copyTraceLink(crop._id)}>
                Copy link
              </button>
            </div>
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
