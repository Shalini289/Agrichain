"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Trash2 } from "lucide-react";
import "@/styles/compare.css";

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

export default function Compare() {
  const [crops, setCrops] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = JSON.parse(localStorage.getItem("agrichain-watchlist") || "[]");
    return Array.isArray(stored) ? stored : [];
  });
  const [sort, setSort] = useState("trust");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load saved crops");
        return res.json();
      })
      .then((data) => setCrops(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const savedCrops = useMemo(
    () =>
      crops
        .filter((crop) => watchlist.includes(crop._id))
        .sort((a, b) => {
          if (sort === "price") return (Number(a.price) || 0) - (Number(b.price) || 0);
          if (sort === "quantity") return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
          return getTrustScore(b) - getTrustScore(a);
        }),
    [crops, sort, watchlist]
  );

  const removeCrop = (cropId) => {
    const next = watchlist.filter((id) => id !== cropId);
    setWatchlist(next);
    localStorage.setItem("agrichain-watchlist", JSON.stringify(next));
  };

  return (
    <main className="compare-page">
      <section className="compare-header">
        <div>
          <p className="compare-eyebrow">Decision desk</p>
          <h1>Compare saved crops</h1>
          <p>Review shortlisted lots by price, quantity, trust score, and public passport before buying.</p>
        </div>
        <Link href="/marketplace">Marketplace</Link>
      </section>

      <section className="compare-toolbar">
        <ArrowUpDown size={18} />
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="trust">Highest trust</option>
          <option value="price">Lowest price</option>
          <option value="quantity">Highest quantity</option>
        </select>
      </section>

      {loading && <div className="compare-state">Loading saved crops...</div>}
      {error && <div className="compare-state">{error}</div>}

      {!loading && !error && savedCrops.length === 0 && (
        <div className="compare-state">
          No saved crops yet. Open the marketplace and tap the star on crop lots you want to compare.
        </div>
      )}

      {!loading && !error && savedCrops.length > 0 && (
        <section className="compare-table">
          <div className="compare-row compare-head">
            <span>Crop</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Trust</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {savedCrops.map((crop) => (
            <div key={crop._id} className="compare-row">
              <span>
                <strong>{crop.name}</strong>
                <small>{crop.location || "No location"}</small>
              </span>
              <span>Rs. {crop.price}</span>
              <span>{crop.quantity}</span>
              <span>{getTrustScore(crop)}%</span>
              <span>{crop.status || "listed"}</span>
              <span className="compare-actions">
                <Link href={`/track/${crop._id}`}>Passport</Link>
                <button type="button" onClick={() => removeCrop(crop._id)} aria-label={`Remove ${crop.name}`}>
                  <Trash2 size={16} />
                </button>
              </span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
