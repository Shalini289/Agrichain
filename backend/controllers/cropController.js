import mongoose from "mongoose";
import Crop from "../models/Crop.js";
import { addCropOnChain } from "../services/blockchainService.js";

const cropStatuses = ["listed", "reserved", "sold"];
const cropQualities = ["standard", "premium", "organic"];
const publicFarmerFields = "name wallet";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const addCrop = async (req, res) => {
  const {
    name,
    quantity,
    price,
    mandiPrice,
    predictedPrice,
    location,
    quality,
    status,
    notes,
  } = req.body;

  try {
    const cropName = typeof name === "string" ? name.trim() : "";
    const cropLocation = typeof location === "string" ? location.trim() : "";
    const cropNotes = typeof notes === "string" ? notes.trim() : "";

    if (!cropName || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: "Name, quantity, and price are required" });
    }

    if (cropName.length > 80) {
      return res.status(400).json({ message: "Crop name must be 80 characters or less" });
    }

    if (cropLocation.length > 120) {
      return res.status(400).json({ message: "Location must be 120 characters or less" });
    }

    if (cropNotes.length > 500) {
      return res.status(400).json({ message: "Notes must be 500 characters or less" });
    }

    if (quality && !cropQualities.includes(quality)) {
      return res.status(400).json({ message: "Invalid crop quality" });
    }

    if (status && !cropStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid crop status" });
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);
    const numericMandiPrice = mandiPrice === undefined || mandiPrice === "" ? undefined : Number(mandiPrice);
    const numericPredictedPrice =
      predictedPrice === undefined || predictedPrice === "" ? undefined : Number(predictedPrice);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (numericMandiPrice !== undefined && (!Number.isFinite(numericMandiPrice) || numericMandiPrice <= 0)) {
      return res.status(400).json({ message: "Mandi price must be a positive number" });
    }

    if (
      numericPredictedPrice !== undefined &&
      (!Number.isFinite(numericPredictedPrice) || numericPredictedPrice <= 0)
    ) {
      return res.status(400).json({ message: "Predicted price must be a positive number" });
    }

    let txHash = null;
    let blockchainWarning = "";
    try {
      txHash = await addCropOnChain(cropName, numericQuantity, numericPrice);
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
      name: cropName,
      quantity: numericQuantity,
      price: numericPrice,
      mandiPrice: numericMandiPrice,
      predictedPrice: numericPredictedPrice,
      location: cropLocation,
      quality: quality || "standard",
      status: status || "listed",
      notes: cropNotes,
      farmer: req.user._id,
      txHash,
      history: [{ role: "Farmer" }],
    });

    res.json({
      ...crop.toObject(),
      blockchainWarning,
    });
  } catch (err) {
    console.error("Add crop failed:", err.message);
    res.status(500).json({ message: "Unable to add crop" });
  }
};

export const updateCropStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!cropStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid crop status" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid crop id" });
    }

    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (crop.farmer && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own crop" });
    }

    crop.status = status;
    crop.history.push({
      role: `Status: ${status}`,
      timestamp: new Date(),
    });

    await crop.save();
    await crop.populate("farmer", publicFarmerFields);

    res.json(crop);
  } catch (err) {
    console.error("Update crop status failed:", err.message);
    res.status(500).json({ message: "Unable to update crop status" });
  }
};

export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmer", publicFarmerFields);
    res.json(crops);
  } catch (err) {
    console.error("Get crops failed:", err.message);
    res.status(500).json({ message: "Unable to load crops" });
  }
};

export const getCrop = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid crop id" });
    }

    const crop = await Crop.findById(req.params.id).populate("farmer", publicFarmerFields);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(crop);
  } catch (err) {
    console.error("Get crop failed:", err.message);
    res.status(500).json({ message: "Unable to load crop" });
  }
};
