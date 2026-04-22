"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Chart({ prices }) {
  const data = {
    labels: prices.map((_, i) => i+1),
    datasets: [{
      label: "Price Trend",
      data: prices,
      borderColor: "#00c6ff"
    }]
  };

  return <Line data={data} />;
}