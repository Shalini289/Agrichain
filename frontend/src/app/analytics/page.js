"use client";

import { useEffect, useState } from "react";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`)
      .then(res => res.json())
      .then(crops => {
        const prices = crops.map(c => c.price);
        setData(prices);
      });
  }, []);

  return (
    <div>
      <h1>📈 Analytics</h1>

      {data.length > 0 ? (
        <AdvancedAnalytics data={data} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}