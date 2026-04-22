import { apiRequest } from "./api";

// ➕ Add Crop
export const addCrop = (data) =>
  apiRequest("/api/crops", {
    method: "POST",
    body: JSON.stringify(data),
  });

// 📥 Get all crops
export const getCrops = () =>
  apiRequest("/api/crops");

// 📄 Get single crop
export const getCrop = (id) =>
  apiRequest(`/api/crops/${id}`);