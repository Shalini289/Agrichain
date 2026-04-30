import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    quantity: {
      type: Number,
      min: 0,
      required: true
    },

    price: {
      type: Number,
      min: 0,
      required: true
    },

    mandiPrice: {
      type: Number,
      min: 0
    },

    predictedPrice: {
      type: Number,
      min: 0
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120
    },

    quality: {
      type: String,
      enum: ["standard", "premium", "organic"],
      default: "standard"
    },

    status: {
      type: String,
      enum: ["listed", "reserved", "sold"],
      default: "listed"
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    txHash: {
      type: String,
      trim: true
    },

    history: [
      {
        role: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Crop", cropSchema);
