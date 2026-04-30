"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Scale, ShieldCheck, Star } from "lucide-react";
import "@/styles/marketplace.css";

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

const getPriceSignal = (crop) => {
  const price = Number(crop.price) || 0;
  const mandi = Number(crop.mandiPrice) || 0;

  if (!price || !mandi) return "No benchmark";
  if (price < mandi) return "Below mandi";
  if (price === mandi) return "At mandi";
  return "Above mandi";
};

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = JSON.parse(localStorage.getItem("agrichain-watchlist") || "[]");
    return Array.isArray(stored) ? stored : [];
  });
  const [query, setQuery] = useState("");
  const [quality, setQuality] = useState("all");
  const [status, setStatus] = useState("all");
  const [onlyOnChain, setOnlyOnChain] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load marketplace");
        return res.json();
      })
      .then((data) => setCrops(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredCrops = useMemo(
    () =>
      crops
        .filter((crop) => {
          const text = `${crop.name || ""} ${crop.location || ""} ${crop.quality || ""}`.toLowerCase();
          return text.includes(query.trim().toLowerCase());
        })
        .filter((crop) => quality === "all" || crop.quality === quality)
        .filter((crop) => status === "all" || crop.status === status)
        .filter((crop) => !onlyOnChain || crop.txHash)
        .sort((a, b) => getTrustScore(b) - getTrustScore(a)),
    [crops, onlyOnChain, quality, query, status]
  );

  const totalValue = filteredCrops.reduce(
    (sum, crop) => sum + (Number(crop.quantity) || 0) * (Number(crop.price) || 0),
    0
  );

  const toggleWatchlist = (cropId) => {
    const next = watchlist.includes(cropId)
      ? watchlist.filter((id) => id !== cropId)
      : [...watchlist, cropId];

    setWatchlist(next);
    localStorage.setItem("agrichain-watchlist", JSON.stringify(next));
  };

  return (
    <main className="marketplace-page">
      <section className="marketplace-header">
        <div>
          <p className="marketplace-eyebrow">Buyer marketplace</p>
          <h1>Verified crop lots</h1>
          <p>Browse live produce, compare market signals, and save crops before contacting farmers.</p>
        </div>
        <Link href="/compare" className="marketplace-primary">
          <Scale size={17} />
          Compare saved
        </Link>
      </section>

      <section className="marketplace-stats">
        <div>
          <BarChart3 size={18} />
          <span>{filteredCrops.length} lots</span>
        </div>
        <div>
          <ShieldCheck size={18} />
          <span>{filteredCrops.filter((crop) => crop.txHash).length} on-chain</span>
        </div>
        <div>
          <CheckCircle2 size={18} />
          <span>Rs. {totalValue.toLocaleString("en-IN")} visible value</span>
        </div>
      </section>

      <section className="marketplace-filters">
        <input
          value={query}
          placeholder="Search crop, location, quality..."
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={quality} onChange={(event) => setQuality(event.target.value)}>
          <option value="all">All quality</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="organic">Organic</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All status</option>
          <option value="listed">Listed</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={onlyOnChain}
            onChange={(event) => setOnlyOnChain(event.target.checked)}
          />
          On-chain only
        </label>
      </section>

      {loading && <div className="marketplace-state">Loading marketplace...</div>}
      {error && <div className="marketplace-state">{error}</div>}

      {!loading && !error && (
        <section className="marketplace-grid">
          {filteredCrops.length === 0 && <div className="marketplace-state">No crops match these filters</div>}

          {filteredCrops.map((crop) => {
            const saved = watchlist.includes(crop._id);
            const trustScore = getTrustScore(crop);

            return (
              <article key={crop._id} className="market-card">
                <div className="market-card-top">
                  <div>
                    <span>{crop.quality || "standard"}</span>
                    <h2>{crop.name}</h2>
                  </div>
                  <button
                    type="button"
                    className={saved ? "saved" : ""}
                    onClick={() => toggleWatchlist(crop._id)}
                    aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star size={17} fill={saved ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="market-card-metrics">
                  <div>
                    <span>Price</span>
                    <strong>Rs. {crop.price}</strong>
                  </div>
                  <div>
                    <span>Trust</span>
                    <strong>{trustScore}%</strong>
                  </div>
                  <div>
                    <span>Signal</span>
                    <strong>{getPriceSignal(crop)}</strong>
                  </div>
                </div>

                <p>{crop.quantity} units available</p>
                <p>{crop.location || "Location not provided"}</p>
                <p>{crop.txHash ? "Blockchain verified" : "Local record"}</p>

                <div className="market-card-actions">
                  <Link href={`/track/${crop._id}`}>Passport</Link>
                  <Link href="/compare">Compare</Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
