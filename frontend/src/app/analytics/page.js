"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "../../components/Chart";

export default function Analytics() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/crops")
      .then(res => {
        const p = res.data.map(c => c.price);
        setPrices(p);
      });
  }, []);

  return (
    <div className="card">
      <h2>Analytics</h2>
      <Chart prices={prices} />
    </div>
  );
}