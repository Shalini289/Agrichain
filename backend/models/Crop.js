import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  name: String,
  price: Number,
  mandiPrice: Number,
  predictedPrice: Number,
  farmer: String,
  txHash: String
});

export default mongoose.model("Crop", cropSchema);