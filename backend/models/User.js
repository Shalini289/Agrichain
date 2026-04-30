import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80 },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: String,
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    wallet: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["farmer", "buyer", "admin"],
      default: "farmer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
