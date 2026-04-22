import Crop from "../models/Crop.js";
import { addCropOnChain } from "../services/blockchainService.js";

// ➕ ADD CROP
export const addCrop = async (req, res) => {
  const { name, quantity, price } = req.body;

  try {
    const txHash = await addCropOnChain(name, quantity, price);

    const crop = await Crop.create({
      name,
      quantity,
      price,
      farmer: req.user._id,
      txHash,
      history: [{ role: "Farmer" }]
    });

    res.json(crop);

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