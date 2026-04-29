import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    wallet: String,
    role: { type: String, default: "farmer" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);