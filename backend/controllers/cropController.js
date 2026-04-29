import Crop from "../models/Crop.js";
import { addCropOnChain } from "../services/blockchainService.js";

// ➕ ADD CROP
export const addCrop = async (req, res) => {
  const { name, quantity, price } = req.body;

  try {
    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: "Name, quantity, and price are required" });
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    let txHash = null;
    let blockchainWarning = "";
    try {
      txHash = await addCropOnChain(name.trim(), numericQuantity, numericPrice);
    } catch (chainErr) {
      if (process.env.BLOCKCHAIN_REQUIRED === "true") {
        throw chainErr;
      }

      blockchainWarning =
        chainErr.code === "INSUFFICIENT_FUNDS"
          ? "Crop saved locally. Add Sepolia ETH to the backend wallet to write future crops on-chain."
          : "Crop saved locally. Blockchain write was skipped.";
      console.warn("Blockchain write skipped:", chainErr.message);
    }

    const crop = await Crop.create({
      name: name.trim(),
      quantity: numericQuantity,
      price: numericPrice,
      farmer: req.user._id,
      txHash,
      history: [{ role: "Farmer" }]
    });

    res.json({
      ...crop.toObject(),
      blockchainWarning,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 GET ALL CROPS
export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmer", "name");
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 GET SINGLE CROP
export const getCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmer");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(crop);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
