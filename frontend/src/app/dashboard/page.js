"use client";
import { useEffect, useState } from "react";
import { getCrops } from "../../services/api";
import CropCard from "../../components/CropCard";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    getCrops().then(res => setCrops(res.data));
  }, []);

  return (
    <>
      <h1>📊 Dashboard</h1>
      {crops.map(c => <CropCard key={c._id} crop={c} />)}
    </>
  );
}