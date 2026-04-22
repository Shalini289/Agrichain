import axios from "axios";

const API = "http://localhost:5000/api";

export const getCrops = () => axios.get(`${API}/crops`);
export const getCrop = (id) => axios.get(`${API}/crops/${id}`);
export const addCrop = (data) => axios.post(`${API}/crops`, data);