"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/track.css";

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

const buildMosaic = (seed) => {
  const text = seed || "agrichain";
  return Array.from({ length: 49 }, (_, index) => {
    const code = text.charCodeAt(index % text.length) || 0;
    return (code + index * 11) % 4 !== 0;
  });
};

const formatDate = (value) => {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function CropPassport() {
  const params = useParams();
  const cropId = params?.id;
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trustScore = crop ? getTrustScore(crop) : 0;
  const mosaic = useMemo(() => buildMosaic(`${crop?._id || cropId}${crop?.name || ""}`), [crop, cropId]);
  const timeline = crop
    ? [
        { role: "Created", timestamp: crop.createdAt },
        ...(Array.isArray(crop.history) ? crop.history : []),
      ]
    : [];

  useEffect(() => {
    if (!cropId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops/${cropId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Crop passport not found");
        return res.json();
      })
      .then((data) => setCrop(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [cropId]);

  return (
    <main className="track-page">
      <section className="track-hero">
        <div>
          <p className="track-eyebrow">Public crop passport</p>
          <h1>{crop?.name || "Crop trace"}</h1>
          <p>
            A shareable verification page for crop identity, farmer provenance, market signals,
            and lifecycle status.
          </p>
        </div>
        <Link href="/dashboard">Dashboard</Link>
      </section>

      {loading && <div className="track-state">Loading crop passport...</div>}
      {error && <div className="track-state">{error}</div>}

      {!loading && !error && crop && (
        <section className="passport-shell">
          <div className="passport-main">
            <div className="passport-title">
              <div>
                <span>{crop.quality || "standard"} grade</span>
                <h2>{crop.name}</h2>
              </div>
              <strong>{crop.status || "listed"}</strong>
            </div>

            <div className="passport-grid">
              <div>
                <span>Trust score</span>
                <strong>{trustScore}%</strong>
              </div>
              <div>
                <span>Lot value</span>
                <strong>Rs. {((Number(crop.quantity) || 0) * (Number(crop.price) || 0)).toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Quantity</span>
                <strong>{crop.quantity}</strong>
              </div>
              <div>
                <span>Farmer</span>
                <strong>{crop.farmer?.name || "Verified seller"}</strong>
              </div>
            </div>

            <div className="passport-details">
              <p><span>Price</span>Rs. {crop.price}</p>
              {crop.mandiPrice && <p><span>Mandi price</span>Rs. {crop.mandiPrice}</p>}
              {crop.predictedPrice && <p><span>AI price</span>Rs. {crop.predictedPrice}</p>}
              <p><span>Location</span>{crop.location || "Not provided"}</p>
              <p><span>Blockchain</span>{crop.txHash ? crop.txHash : "Local record pending on-chain write"}</p>
              {crop.notes && <p><span>Notes</span>{crop.notes}</p>}
            </div>
          </div>

          <aside className="passport-side">
            <div className="passport-qr" aria-label="Crop verification mosaic">
              {mosaic.map((filled, index) => (
                <span key={index} className={filled ? "filled" : ""} />
              ))}
            </div>
            <p>Scan-style proof generated from this crop ID.</p>
          </aside>

          <div className="passport-timeline">
            <h3>Trace timeline</h3>
            {timeline.map((item, index) => (
              <div key={`${item.role}-${index}`} className="timeline-item">
                <span />
                <div>
                  <strong>{item.role}</strong>
                  <p>{formatDate(item.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
