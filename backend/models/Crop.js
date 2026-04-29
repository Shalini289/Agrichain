import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    quantity: Number,

    price: Number,

    mandiPrice: Number,

    predictedPrice: Number,

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    txHash: String,

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